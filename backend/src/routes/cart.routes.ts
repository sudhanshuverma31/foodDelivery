import { Router } from 'express';
import { addToCart, getCart, updateCartItem, removeCartItem } from '../controllers/addToCart';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate as any, getCart as any);
router.post('/items', authenticate as any, addToCart as any);
router.patch('/items/:productId', authenticate as any, updateCartItem as any);
router.delete('/items/:productId', authenticate as any, removeCartItem as any);

export default router;
