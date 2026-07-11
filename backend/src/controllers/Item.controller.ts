import { Request, Response } from 'express';
import { uploadToCloudinary } from '../config/cloudinary';
import { ShopModel } from '../models/shop.model';
import { ItemModel } from '../models/item.model';

import { AuthRequest } from '../middleware/auth.middleware';

export const addItem = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;

    if (req.file?.buffer) {
      const result: any = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    const shop = await ShopModel.findOne({ owner: req.user?.id });
    if (!shop) {
      return res.status(400).json({ message: 'shop not found' });
    }

    const newItem = await ItemModel.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id
    });

    return res.status(201).json(newItem);
  } catch (error) {
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