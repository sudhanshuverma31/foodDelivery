import express from "express";

import {authenticate} from '../middleware/auth.middleware'
import { createShop, getShop, updateShop, getAllShops } from "../controllers/shop.controller";
import { upload } from "../middleware/upload.middleware";
const shopRouter = express.Router();

shopRouter.post('/create-shop', authenticate as any, upload.single('image'), createShop as any);
shopRouter.get('/get-shop', authenticate as any, getShop as any);
shopRouter.put('/update-shop', authenticate as any, upload.single('image'), updateShop as any);
shopRouter.get('/all-shops', getAllShops as any);

export default shopRouter;
