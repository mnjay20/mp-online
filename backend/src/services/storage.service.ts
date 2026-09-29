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
}
