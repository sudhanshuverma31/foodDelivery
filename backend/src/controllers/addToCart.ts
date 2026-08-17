import { Response } from 'express';
import { CartModel } from '../models/addToCart';
import { AuthRequest } from '../middleware/auth.middleware';

export async function addToCart(req: AuthRequest, res: Response) {
  try {
    const { productId, name, price, image, quantity = 1 } = req.body;
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    if (!productId || !name || !Number.isFinite(parsedPrice) || parsedPrice < 0 || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({ error: 'A valid productId, name, price, and quantity are required.' });
    }

    const cart = await CartModel.findOneAndUpdate(
      { user: req.user!.id, 'items.productId': productId },
      { $inc: { 'items.$.quantity': parsedQuantity } },
      { new: true }
    );

    if (cart) return res.status(200).json(cart);

    const newCart = await CartModel.findOneAndUpdate(
      { user: req.user!.id },
      { $push: { items: { productId, name, price: parsedPrice, image, quantity: parsedQuantity } } },

    );
    return res.status(201).json(newCart);
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({ error: 'Unable to save the cart item.' });
  }
}

export async function getCart(req: AuthRequest, res: Response) {
  try {
    const cart = await CartModel.findOne({ user: req.user!.id });
    return res.status(200).json(cart ?? { items: [] });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ error: 'Unable to load the cart.' });
  }
}

export async function updateCartItem(req: AuthRequest, res: Response) {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive integer.' });
    }
    const cart = await CartModel.findOneAndUpdate(
      { user: req.user!.id, 'items.productId': req.params.productId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );
    if (!cart) return res.status(404).json({ error: 'Cart item not found.' });
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Update cart error:', error);
    return res.status(500).json({ error: 'Unable to update the cart item.' });
  }
}

export async function removeCartItem(req: AuthRequest, res: Response) {
  try {
    const cart = await CartModel.findOneAndUpdate(
      { user: req.user!.id },
      { $pull: { items: { productId: req.params.productId } } },
      { new: true }
    );
    return res.status(200).json(cart ?? { items: [] });
  } catch (error) {
    console.error('Remove cart error:', error);
    return res.status(500).json({ error: 'Unable to remove the cart item.' });
  }
}
