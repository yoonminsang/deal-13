import express from 'express';
import { goodsController } from '../controllers/goods.controller.js';

const router = express.Router();

router.get('/detail', goodsController.findGoodsDetail);
router.put('/state', goodsController.updateGoodsSaleState);
router.get('/list', goodsController.findGoods);
router.get('/list/seller', goodsController.findGoodsByUserId);
router.get('/list/wish', goodsController.findGoodsByUserWish);
router.post('/', goodsController.createGoods);
router.put('/', goodsController.updateGoods);
router.get('/menu', goodsController.findGoodsForMenu);
router.delete('/', goodsController.deleteGoodsViewState);

export default router;
