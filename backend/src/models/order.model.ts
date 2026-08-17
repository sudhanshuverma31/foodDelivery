import mongoose, { Schema, Document } from 'mongoose';
import { isMockDatabase } from '../config/db';

export interface IOrderItem {
    dishId: string;
    quantity: number;
}

export interface IOrder extends Document {
    userId: string;
    items: IOrderItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    address: string;
    pincode: string;
    paymentMethod: string;
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    userId: { type: String, required: true },
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
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

// In-memory orders for mock mode
const MOCK_ORDERS: any[] = [];

export async function createOrder(orderData: {
    userId: string;
    items: { dishId: string; quantity: number }[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    address: string;
    pincode: string;
    paymentMethod: string;
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

export async function getOrders(userId?: string) {
    if (isMockDatabase) {
        if (userId) {
            return MOCK_ORDERS.filter(o => o.userId === userId);
        }
        return MOCK_ORDERS;
    }
    if (userId) {
        return await OrderModel.find({ userId }).sort({ createdAt: -1 });
    }
    return await OrderModel.find({}).sort({ createdAt: -1 });
}
// const shopOrderItemsSchema = new Schema({
//     item: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Item'
//     },
//     price: Number,
//     quantity: Number

// }, { timestamps: true })
// const shopOrderSchema = new Schema({
//     shop: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Shop'
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     subTotal: Number,
//     shopOrderItems: [shopOrderItemsSchema]
// })

// const OrderSchema: Schema = new Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     paymentMethod: {
//         type: String,
//         enum: ['online', 'COD'],
//         required: true
//     },
//     deliveryAddress: {
//         text: String,
//         latitude: Number,
//         longitude: Number,
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'accepted', 'completed', 'rejected'],
//         default: 'pending'
//     },
//     deliveryFee: {
//         type: Number,
//         required: true
//     },
//     totalAmount: {
//         type: Number,
//         required: true
//     },
//     shopOrders: [shopOrderSchema],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// }, { timestamps: true })

// export const OrderModel = mongoose.model('Order', OrderSchema);

