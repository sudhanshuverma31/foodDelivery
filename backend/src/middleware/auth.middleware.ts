import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'gourmet_dash_secret_key_123';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    mobile: string;
    role: 'user' | 'owner' | 'deliveryboy';
  };
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Sign in to proceed.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: 'user' | 'owner' | 'deliveryboy' };
    
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User session expired or not found.' });
    }

    req.user = {
      id: user.id || (user as any)._id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired authentication session.' });
  }
}
