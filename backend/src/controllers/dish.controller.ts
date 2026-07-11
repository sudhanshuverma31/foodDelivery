import { Request, Response } from 'express';
import { getDishes, DishModel } from '../models/dish.model';

export async function handleGetDishes(req: Request, res: Response) {
  try {
    const dishes = await getDishes();
    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function handleUploadDishImage(req: Request & { file?: any }, res: Response) {
  try {
    const dishId = req.params.id;
    if (!req.file || !req.file.cloudinary) {
      return res.status(400).json({ error: 'Upload failed' });
    }
    const imageUrl = req.file.cloudinary.secure_url;

    // Update dish record if using real DB
    if (dishId) {
      await DishModel.findByIdAndUpdate(dishId, { image: imageUrl });
    }

    res.status(200).json({ message: 'Image uploaded', imageUrl });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
