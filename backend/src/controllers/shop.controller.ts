import { Request, Response } from 'express';
import { uploadToCloudinary } from '../config/cloudinary';
import { ShopModel } from '../models/shop.model';
import { ItemModel } from '../models/item.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const createShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, city, state, address, description, category } = req.body;

    if (!req.file?.buffer) {
      return res.status(400).json({ error: 'Shop image is required' });
    }

    const uploadResult: any = await uploadToCloudinary(req.file.buffer);
    const image = uploadResult.secure_url || uploadResult.url;

    if (!image) {
      return res.status(500).json({ error: 'Cloudinary upload returned no image URL' });
    }
    console.log("shop is creating")
    const newShop = await ShopModel.create({
      name,
      city,
      state,
      address,
      description,
      category,
      image,
      owner: req.user?.id
    });

    await newShop.save();
    await newShop.populate('owner');

    console.log('shop is created');

    return res.status(201).json(newShop);
  } catch (error) {
    console.error('createShop error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getShop = async (req: AuthRequest, res: Response) => {
  try {
    console.log("getShop");
    const shops = await ShopModel.find(req.user?.id ? { owner: req.user?.id } : {}).populate('owner');
    if (!shops || shops.length === 0) {
      return res.status(404).json({ error: 'No shops found for this user.' });
    }
    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}

export const updateShop = async (req: AuthRequest, res: Response) => {
  try {
    const { name, city, state, address, description, category } = req.body;
    let image;

    if (req.file?.buffer) {
      const uploadResult: any = await uploadToCloudinary(req.file.buffer);
      image = uploadResult.secure_url || uploadResult.url;
    }

    const updateFields: any = { name, city, state, address, description, category };
    if (image) {
      updateFields.image = image;
    }

    const updatedShop = await ShopModel.findOneAndUpdate(
      { owner: req.user?.id },
      updateFields,
      { new: true }
    ).populate('owner');

    if (!updatedShop) {
      return res.status(404).json({ error: 'Shop not found.' });
    }

    return res.status(200).json(updatedShop);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllShops = async (req: Request, res: Response) => {
  try {
    const { city } = req.query;
    const filter = city ? { city: new RegExp(String(city), 'i') } : {};
    const shops = await ShopModel.find(filter).populate('owner').lean();

    // Dynamically retrieve menu items for each shop
    const shopsWithItems = await Promise.all(
      shops.map(async (shop) => {
        const items = await ItemModel.find({ shop: shop._id });
        return { ...shop, items };
      })
    );

    return res.status(200).json(shopsWithItems);
  } catch (error) {
    return res.status(550).json({ error: (error as Error).message });
  }
};

