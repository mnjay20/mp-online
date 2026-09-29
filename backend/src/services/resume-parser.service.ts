import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { BadRequestError } from '../utils/errors.js';
import { logger } from '../lib/logger.js';

export class ResumeParserService {
  /**
   * Extracts raw UTF-8 text from an in-memory document buffer (PDF or DOCX).
   */
  static async extractRawText(fileBuffer: Buffer, mimeType: string, originalFilename?: string): Promise<string> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestError('Uploaded file buffer is empty.');
    }

    try {
      // 1. PDF Documents
      if (mimeType === 'application/pdf') {
        const parser = new PDFParse({ data: fileBuffer });
        const result = await parser.getText();
        const text = (result?.text || '').trim();

        if (!text) {
          logger.warn(`PDF parser returned empty text for file: ${originalFilename}`);
        }
        return this.cleanExtractedText(text);
      }

      // 2. DOCX / DOC Documents
      if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword'
      ) {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        const text = (result?.value || '').trim();

        if (!text) {
          logger.warn(`Mammoth returned empty text for Word document: ${originalFilename}`);
        }
        return this.cleanExtractedText(text);
      }

      throw new BadRequestError(`Unsupported document format: ${mimeType}`);
    } catch (err: any) {
      if (err instanceof BadRequestError) throw err;
      logger.error(`Error parsing document '${originalFilename}':`, { error: err.message });
      throw new BadRequestError(`Failed to extract text from resume: ${err.message || 'Corrupted file'}`);
    }
  }

  /**
   * Cleans extracted text to remove null characters and excessive whitespace.
   */
  private static cleanExtractedText(text: string): string {
    return text
      .replace(/\0/g, '') // Remove null bytes
      .replace(/[\r\n]{3,}/g, '\n\n') // Collapse excessive newlines
      .trim();
  }
}
