import { Request, Response } from 'express';
import { cloudinary, isCloudinaryConfigured } from '../../config/cloudinary';
import { AppError } from '../../middleware/errorHandler';

export class UploadController {
  // POST /api/upload/image - Upload profile photo or verification selfie to Cloudinary
  static async uploadImage(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      throw new AppError('Image file is required (field name: image)', 400);
    }

    const folder =
      typeof req.body?.folder === 'string' && req.body.folder.trim()
        ? `thedateboss/${req.body.folder.trim()}`
        : 'thedateboss/uploads';

    if (!isCloudinaryConfigured()) {
      throw new AppError('Cloudinary credentials are not configured on the server', 500);
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          });
        }
      );

      stream.end(req.file!.buffer);
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  }
}
