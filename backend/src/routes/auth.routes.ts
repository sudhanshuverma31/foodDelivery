import { Router } from 'express';
import { handleSignUp, handleSignIn, handleSignOut, handleGetMe, handleGoogleSignIn, sendOtp, verifyOtp, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
const router = Router();

router.post('/signup', handleSignUp);
router.post('/signin', handleSignIn);
router.post('/google', handleGoogleSignIn);
router.post('/signout', handleSignOut);
router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);
router.post('/resetPassword', resetPassword);
router.get('/me', authenticate as any, handleGetMe as any);

export default router;
