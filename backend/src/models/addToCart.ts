import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1, default: 1 }
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] }
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<ICart>('UserCart', CartSchema);
