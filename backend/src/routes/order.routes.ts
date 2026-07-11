import { Router } from 'express';
import { handleCreateOrder, handleGetOrders } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Allow getting orders (we protect with auth)
router.get('/', authenticate as any, handleGetOrders as any);

// Protect order creation
router.post('/', authenticate as any, handleCreateOrder as any);

export default router;
