import mongoose, { Schema, Document } from 'mongoose';
import { isMockDatabase } from '../config/db';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string; // Hashed password
  role: 'user' | 'owner' | 'deliveryboy';
  resetOtp: number;
  isOtpVerified: boolean;
  otpExpiresAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: false, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'deliveryboy'], default: 'user' },
  resetOtp: {
    type: Number
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  otpExpiresAt: {
    type: Date
  }
}, {
  timestamps: true

});

export const UserModel = mongoose.model<IUser>('User', UserSchema);

// In-Memory User Mock DB
export interface IMockUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'user' | 'owner' | 'deliveryboy';
  resetOtp?: number;
  isOtpVerified?: boolean;
  otpExpiresAt?: Date;
}

const MOCK_USERS: IMockUser[] = [];

export async function findUserByEmail(email: string) {
  if (isMockDatabase) {
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }
  return await UserModel.findOne({ email });
}

export async function findUserById(id: string) {
  if (isMockDatabase) {
    const user = MOCK_USERS.find(u => u.id === id);
    return user || null;
  }
  return await UserModel.findById(id);
}

export async function createUser(userData: {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: 'user' | 'owner' | 'deliveryboy';
}) {
  if (isMockDatabase) {
    // Check uniqueness
    const existing = MOCK_USERS.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('Email already registered');
    }

    const newUser: IMockUser = {
      id: new mongoose.Types.ObjectId().toString(),
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile ?? '',
      password: userData.password,
      role: userData.role,
      isOtpVerified: false
    };
    if (userData.mobile) newUser.mobile = userData.mobile;
    MOCK_USERS.push(newUser);
    return newUser;
  }

  const newUser = new UserModel({
    name: userData.name,
    email: userData.email,
    mobile: userData.mobile ?? '',
    password: userData.password,
    role: userData.role
  });
  return await newUser.save();
}
