import { Response } from 'express';
import { createOrder, getOrders } from '../models/order.model';
import { AuthRequest } from '../middleware/auth.middleware';

const ELIGIBLE_PINCODES = ['400001', '400002', '110001', '110002', '560001', '560002', '700001', '700002'];

export async function handleCreateOrder(req: AuthRequest, res: Response) {
  try {
    const { items, subtotal, deliveryFee, tax, total, address, pincode, paymentMethod } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: 'Sign in to place an order.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }

    if (!address || !pincode) {
      return res.status(400).json({ error: 'Delivery address and pincode are required.' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Please select a payment method.' });
    }

    const validPaymentMethods = ['Cash', 'UPI', 'Credit Card'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method selected.' });
    }

    const cleanPincode = pincode.toString().trim();
    if (!ELIGIBLE_PINCODES.includes(cleanPincode)) {
      return res.status(400).json({ 
        error: `Delivery is not available for pincode ${cleanPincode}. We currently only deliver to: ${ELIGIBLE_PINCODES.join(', ')}` 
      });
    }

    const order = await createOrder({
      userId: req.user.id,
      items,
      subtotal,
      deliveryFee,
      tax,
      total,
      address,
      pincode: cleanPincode,
      paymentMethod
    });
    
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function handleGetOrders(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Sign in to view orders.' });
    }
    const orders = await getOrders(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
