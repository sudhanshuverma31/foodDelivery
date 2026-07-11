import express from "express";

import {authenticate} from '../middleware/auth.middleware'
import { createShop } from "../controllers/shop.controller";
import router from "./upload.routes";
import { upload } from "../middleware/upload.middleware";
const shopRouter = express.Router();

shopRouter.post('/create-shop', authenticate,upload.single('image'), createShop);

export default shopRouter;
