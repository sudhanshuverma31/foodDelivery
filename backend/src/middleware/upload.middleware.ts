import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary as uploadBufferToCloudinary } from '../config/cloudinary';
import { upload } from './multer';

export { upload };

export async function uploadToCloudinaryMiddleware(req: Request & { file?: any }, res: Response, next: NextFunction) {
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await uploadBufferToCloudinary(req.file.buffer);
    req.file.cloudinary = result;
    next();
  } catch (err) {
    next(err);
  }
}
