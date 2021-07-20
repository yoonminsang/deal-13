import express from 'express';
import { goodsController } from '../controllers/goods.controller.js';

const router = express.Router();

router.get('/detail', goodsController.findGoodsDetail);
router.put('/state', goodsController.updateGoodsSaleState);
router.get('/', goodsController.findGoods);
router.post('/', goodsController.createGoods);
router.put('/', goodsController.updateGoods);
router.delete('/', goodsController.deleteGoodsViewState);

export default router;
