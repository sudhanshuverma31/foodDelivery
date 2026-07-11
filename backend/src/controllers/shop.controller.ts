import { Request, Response } from 'express';
import { uploadToCloudinary } from '../config/cloudinary';
import { ShopModel } from '../models/shop.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const createShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, city, state, address } = req.body;
    let image;

    if (req.file?.buffer) {
      image = await uploadToCloudinary(req.file.buffer);
    }

    const newShop = await ShopModel.create({
      name,
      city,
      state,
      address,
      image,
      owner: req.user?.id
    });

    await newShop.save();
    await newShop.populate('owner');

    return res.status(201).json(newShop);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

