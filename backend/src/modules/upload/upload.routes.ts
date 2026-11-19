import { Router } from 'express';
import multer from 'multer';
import { UploadController } from './upload.controller';
import { authenticateUser } from '../../middleware/auth';
import { asyncHandler, AppError } from '../../middleware/errorHandler';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new AppError('Only image files are allowed', 400));
    }
    cb(null, true);
  },
});

router.use(authenticateUser);

router.post('/image', upload.single('image'), asyncHandler(UploadController.uploadImage));

export default router;
