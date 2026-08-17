import { Request, Response } from 'express';
import { uploadToCloudinary } from '../config/cloudinary';
import { ShopModel } from '../models/shop.model';
import { ItemModel } from '../models/item.model';

import { AuthRequest } from '../middleware/auth.middleware';

export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;

    if (!name || !category || !foodType || !price) {
      return res.status(400).json({ message: 'All item fields are required' });
    }

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber)) {
      return res.status(400).json({ message: 'Price must be a valid number' });
    }

    const normalizedFoodType =
      foodType.trim().toLowerCase() === 'non veg' || foodType.trim().toLowerCase() === 'non-veg'
        ? 'Non-Veg'
        : foodType.trim().toLowerCase() === 'veg'
          ? 'Veg'
          : foodType;

    const normalizedCategory = category.trim();

    console.log(req.body);
    if (req.file?.buffer) {
      const result: any = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }
    if (!image) {
      return res.status(400).json({ message: 'image not found' });
    }

    console.log('image is exist');
    const shop = await ShopModel.findOne({ owner: req.user?.id });
    if (!shop) {
      console.log('shop not found');
      return res.status(400).json({ message: 'shop not found' });
    }
    console.log(shop);

    const newItem = await ItemModel.create({
      name,
      category: normalizedCategory,
      foodType: normalizedFoodType,
      price: priceNumber,
      image,
      shop: shop._id
    });
    await newItem.save();
    console.log('Item created');
    return res.status(201).json(newItem);
  } catch (error: any) {
    console.error('addItem error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'add item error' });
  }
};

export const editItem = async (req: Request, res: Response) => {
  try {
    const itemId = req.params.id;
    const { name, category, foodType, price } = req.body;
    let image;

    if (req.file?.buffer) {
      const result: any = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    const updatedItem = await ItemModel.findByIdAndUpdate(
      itemId,
      { name, category, foodType, price, image },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'item not found' });
    }

    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: 'edit item error' });
  }
};

export const getMyItems = async (req: AuthRequest, res: Response) => {
  try {
    const shop = await ShopModel.findOne({ owner: req.user?.id });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    const items = await ItemModel.find({ shop: shop._id });
    return res.status(200).json(items);
  } catch (error: any) {
    return res.status(500).json({ message: 'Get items error', error: error.message });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    const itemId = req.params.id;
    const item = await ItemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'item not found' });
    }

    const shop = await ShopModel.findOne({ _id: item.shop, owner: req.user?.id });
    if (!shop) {
      return res.status(403).json({ message: 'Unauthorized to delete this item' });
    }

    await ItemModel.findByIdAndDelete(itemId);

    await ShopModel.findByIdAndUpdate(item.shop, {
      $pull: { items: itemId }
    });

    return res.status(200).json({ message: 'Item deleted successfully', id: itemId });
  } catch (error: any) {
    console.error('deleteItem error:', error);
    return res.status(500).json({ message: 'delete item error' });
  }
};
