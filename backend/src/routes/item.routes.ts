import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { addItem, editItem, getMyItems, deleteItem } from '../controllers/Item.controller';

const router = express.Router();

router.post('/add-item', authenticate as any, upload.single('image'), addItem as any);
router.put('/:id', authenticate as any, upload.single('image'), editItem as any);
router.get('/my-items', authenticate as any, getMyItems as any);
router.delete('/:id', authenticate as any, deleteItem as any);

export default router;
