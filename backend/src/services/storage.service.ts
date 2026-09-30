import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../lib/logger.js';
import { InternalServerError } from '../utils/errors.js';

export class SupabaseStorageService {
  private static readonly BUCKET_NAME = 'resumes';

  /**
   * Uploads a resume buffer to private Supabase Storage bucket.
   * Path: resumes/<userId>/<timestamp>-<sanitized_filename>
   */
  static async uploadResume(
    userId: string,
    originalName: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const sanitizedFilename = originalName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
    const storagePath = `${userId}/${Date.now()}-${sanitizedFilename}`;

    const { error } = await supabaseAdmin.storage
      .from(this.BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      logger.error('Supabase storage upload error:', { error, path: storagePath });
      throw new InternalServerError(`Failed to upload resume to secure storage: ${error.message}`);
    }

    logger.info(`Resume uploaded successfully to private storage: ${storagePath}`);
    return storagePath;
  }

  /**
   * Generates a temporary, time-limited signed URL for authorized viewing/downloading.
   */
  static async createSignedUrl(storagePath: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(this.BUCKET_NAME)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      logger.error('Failed to generate signed download URL:', { error, path: storagePath });
      throw new InternalServerError('Unable to generate secure download link for resume.');
    }

    return data.signedUrl;
  }

  /**
   * Removes a resume file from storage.
   */
  static async deleteResume(storagePath: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(this.BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      logger.warn(`Failed to delete resume file at ${storagePath}: ${error.message}`);
    }
  }

  private static readonly REPORTS_BUCKET = 'reports';

  /**
   * Uploads an interview assessment PDF to private storage.
   */
  static async uploadReportPdf(
    studentId: string,
    interviewId: string,
    fileBuffer: Buffer
  ): Promise<string> {
    const storagePath = `interviews/${studentId}/${interviewId}.pdf`;

    // Attempt upload to reports bucket
    const { error } = await supabaseAdmin.storage
      .from(this.REPORTS_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      // Fallback to resumes bucket under reports/ folder
      const fallbackPath = `reports/${studentId}/${interviewId}.pdf`;
      const { error: fallbackErr } = await supabaseAdmin.storage
        .from(this.BUCKET_NAME)
        .upload(fallbackPath, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (fallbackErr) {
        logger.error('Failed to upload report PDF to storage:', { error, fallbackErr });
        return '';
      }
      return `${this.BUCKET_NAME}:${fallbackPath}`;
    }

    return `${this.REPORTS_BUCKET}:${storagePath}`;
  }

  /**
   * Generates a signed URL for an interview report PDF.
   */
  static async createReportSignedUrl(
    storageIdentifier: string,
    expiresInSeconds = 604800 // 7 days
  ): Promise<string> {
    if (!storageIdentifier) return '';
    const [bucket, ...pathParts] = storageIdentifier.includes(':')
      ? storageIdentifier.split(':')
      : [this.REPORTS_BUCKET, storageIdentifier];
    const path = pathParts.join(':');

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return '';
    }
    return data.signedUrl;
  }
}
