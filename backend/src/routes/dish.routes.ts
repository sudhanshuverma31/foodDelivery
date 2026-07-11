import { Router } from 'express';
import { handleGetDishes, handleUploadDishImage } from '../controllers/dish.controller';
import { upload, uploadToCloudinaryMiddleware } from '../middleware/upload.middleware';

const router = Router();

router.get('/', handleGetDishes);

// Upload image for a dish: multipart form 'image'
router.post('/:id/image', upload.single('image'), uploadToCloudinaryMiddleware, handleUploadDishImage);

export default router;
