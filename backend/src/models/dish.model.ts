import mongoose, { Schema, Document } from 'mongoose';
import { isMockDatabase } from '../config/db';

export interface IDish extends Document {
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
  time: string;
  image: string;
}

const DishSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  time: { type: String, required: true },
  image: { type: String, required: true }
});

export const DishModel = mongoose.model<IDish>('Dish', DishSchema);

// Mock Storage
const MOCK_DISHES = [
  {
    id: '1',
    name: 'Truffle Glazed Burger',
    price: 16.99,
    category: 'Burgers',
    description: 'Aged wagyu beef patty, black truffle aioli, melted gruyère cheese on a toasted brioche bun.',
    rating: 4.9,
    time: '20-30 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    name: 'Spicy Salmon Crunch Roll',
    price: 18.50,
    category: 'Sushi',
    description: 'Fresh Atlantic salmon, avocado, cucumber, spicy mayo, topped with crispy tempura flakes.',
    rating: 4.8,
    time: '25-35 min',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    name: 'Fig & Prosciutto Pizza',
    price: 19.99,
    category: 'Pizza',
    description: 'Neapolitan style crust, sweet mission figs, prosciutto di Parma, wild arugula, balsamic glaze.',
    rating: 4.7,
    time: '15-25 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '4',
    name: 'Matcha Lava Cake',
    price: 9.50,
    category: 'Desserts',
    description: 'Warm matcha green tea cake with a molten white chocolate core, served with black sesame ice cream.',
    rating: 4.9,
    time: '10-15 min',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '5',
    name: 'Avocado Quinoa Power Bowl',
    price: 14.25,
    category: 'Salads',
    description: 'Tri-color quinoa, organic Haas avocado, roasted chickpeas, heirloom tomatoes, lemon tahini dressing.',
    rating: 4.6,
    time: '15-20 min',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '6',
    name: 'Triple Berry Waffles',
    price: 12.00,
    category: 'Desserts',
    description: 'Belgian waffles stacked high with fresh strawberries, blueberries, raspberries, and organic maple syrup.',
    rating: 4.7,
    time: '15-25 min',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=600&q=80'
  }
];

export async function getDishes() {
  if (isMockDatabase) {
    return MOCK_DISHES;
  }
  return await DishModel.find({});
}

export async function seedDishesIfEmpty() {
  if (isMockDatabase) return;
  try {
    const count = await DishModel.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default dishes to MongoDB database...');
      // Remove local client id to let Mongo generate _id
      const seedData = MOCK_DISHES.map(({ id, ...rest }) => rest);
      await DishModel.insertMany(seedData);
      console.log('🌱 Database seeded successfully.');
    }
  } catch (err) {
    console.error('❌ Failed to seed database:', (err as Error).message);
  }
}
