import { Request, Response } from 'express';
import { createOrder, getOrders } from '../models/order.model';

export async function handleCreateOrder(req: Request, res: Response) {
  try {
    const { items, subtotal, deliveryFee, tax, total } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain items' });
    }
    const order = await createOrder({ items, subtotal, deliveryFee, tax, total });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function handleGetOrders(req: Request, res: Response) {
  try {
    const orders = await getOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
