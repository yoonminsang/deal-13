import express from 'express';
import { goodsWishController } from '../controllers/goods-wish.controller.js';

const router = express.Router();

router.post('/', goodsWishController.createGoodsWish);
router.delete('/', goodsWishController.deleteGoodsWish);

export default router;
