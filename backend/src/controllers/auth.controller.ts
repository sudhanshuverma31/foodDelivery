import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, UserModel } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendOTPEmail } from '../utils/mail';
import { firebaseAdminAuth } from '../utils/firebaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'gourmet_dash_secret_key_123';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

function setAuthCookie(res: Response, userId: string, role: string) {
  const token = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // set to true in production if HTTPS is active
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRY
  });
}

export async function handleSignUp(req: Request, res: Response) {
  try {
    const { name, email, mobile, password, role } = req.body;
     console.log("Signing up...")
    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered. Try signing in.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = await createUser({
      name,
      email,
      mobile,
      password: hashedPassword,
      role
    });

    const userId = newUser.id || (newUser as any)._id.toString();

    // Set authorization cookie
    setAuthCookie(res, userId, role);

    res.status(201).json({
      id: userId,
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function handleSignIn(req: Request, res: Response) {
  try {
    console.log("Signing in...")
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. Password incorrect.' });
    }

    const userId = user.id || (user as any)._id.toString();

    // Set authorization cookie
    setAuthCookie(res, userId, user.role);

    res.status(200).json({
      id: userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function handleGoogleSignIn(req: Request, res: Response) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;
    const name = decodedToken.name || decodedToken.email?.split('@')[0];

    if (!email) {
      return res.status(400).json({ error: 'Firebase token did not contain an email address' });
    }

    let user = await findUserByEmail(email);
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-16);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await createUser({
        name: name ?? 'Google User',
        email,
        mobile: '',
        password: hashedPassword,
        role: 'user'
      });
    }

    const userId = user.id || (user as any)._id.toString();
    setAuthCookie(res, userId, user.role);
    res.status(200).json({
      id: userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role
    });
  } catch (err) {
    console.error('Google sign-in error:', err);
    res.status(401).json({ error: 'Unable to verify Google authentication token.' });
  }
}

export async function handleSignOut(req: Request, res: Response) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    });
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function handleGetMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}


export async function sendOtp(req: Request, res: Response) {
  try {
    console.log('Sending OTP...');
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendOTPEmail(email, otp);
    await UserModel.findOneAndUpdate(
      { email },
      {
        resetOtp: otp,
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        isOtpVerified: false
      }
    );
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.resetOtp !== Number(otp)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    await UserModel.findOneAndUpdate(
      { email },
      {
        isOtpVerified: true
      }
    );
    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isOtpVerified) {
      return res.status(400).json({ error: 'OTP not verified' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        resetOtp: null,
        otpExpiresAt: null,
        isOtpVerified: false
      }
    );
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}

