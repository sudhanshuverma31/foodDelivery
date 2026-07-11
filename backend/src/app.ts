import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { isMockDatabase } from './config/db';
import dishRoutes from './routes/dish.routes';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import shopRoutes from './routes/shop.routes';
import itemRoutes from './routes/item.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from local dev servers (any localhost port) and allow non-browser tools with no origin
    if (!origin || String(origin).startsWith('http://localhost')) {
      return callback(null as any, true);
    }
    // fallback: restrict to the original frontend origin if needed
    const allowed = ['http://localhost:5173', 'http://localhost:5174'];
    if (allowed.includes(String(origin))) return callback(null as any, true);
    return callback(new Error('CORS not allowed'), false);
  },
  credentials: true // Allow cookies
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/items', itemRoutes);

// Health / DB status route
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    connected: !isMockDatabase,
    dbType: isMockDatabase ? 'Mock Sandbox (In-Memory)' : 'MongoDB Database'
  });
});

export default app;
