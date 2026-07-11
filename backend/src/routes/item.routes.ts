import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { addItem, editItem } from '../controllers/Item.controller';

const router = express.Router();

router.post('/', authenticate, upload.single('image'), addItem);
router.put('/:id', authenticate, upload.single('image'), editItem);

export default router;
