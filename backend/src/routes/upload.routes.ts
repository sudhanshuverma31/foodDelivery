import express from 'express';
import { uploadToCloudinary } from '../config/cloudinary';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!req.body || !req.body.image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const imageBase64 = req.body.image;
    const matches = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/);

    if (!matches) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const result: any = await uploadToCloudinary(buffer, 'fooddelivery');

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ message: 'Cloudinary upload failed' });
  }
});

export default router;
