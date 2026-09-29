import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors.js';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError(
          `Invalid file format '${file.mimetype}'. Only PDF (.pdf) and Word documents (.docx, .doc) up to 5MB are permitted.`
        )
      );
    }
  },
});

export const uploadResumeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('resume')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new BadRequestError('Resume file size exceeds the 5MB limit. Please upload a smaller file.'));
        }
        return next(new BadRequestError(`File upload error: ${err.message}`));
      }
      return next(err);
    }
    next();
  });
};
