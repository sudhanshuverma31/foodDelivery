import mongoose, { Schema, Document } from 'mongoose';
import { isMockDatabase } from '../config/db';

export interface IOrderItem {
  dishId: string;
  quantity: number;
}

export interface IOrder extends Document {
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  items: [
    {
      dishId: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

// In-memory orders for mock mode
const MOCK_ORDERS: any[] = [];

export async function createOrder(orderData: {
  items: { dishId: string; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}) {
  if (isMockDatabase) {
    const newOrder = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...orderData,
      createdAt: new Date()
    };
    MOCK_ORDERS.push(newOrder);
    console.log(`📦 Mock Order placed: ${JSON.stringify(newOrder, null, 2)}`);
    return newOrder;
  }

  const newOrder = new OrderModel(orderData);
  const savedOrder = await newOrder.save();
  console.log(`📦 MongoDB Order placed: ${savedOrder._id}`);
  return savedOrder;
}

export async function getOrders() {
  if (isMockDatabase) {
    return MOCK_ORDERS;
  }
  return await OrderModel.find({}).sort({ createdAt: -1 });
}
