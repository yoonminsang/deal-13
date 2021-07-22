import express from 'express';
import { goodsChattingController } from '../controllers/goods-chatting.controler.js';

const router = express.Router();

router.get('/detail', goodsChattingController.selectChattingRoomDetail);
router.get('/', goodsChattingController.selectChattingRoom);
router.post('/message', goodsChattingController.createChattingMessage);
router.post('/', goodsChattingController.createChattingRoom);
router.put('/', goodsChattingController.updateChattingMessage);
router.delete('/', goodsChattingController.deleteChattingRoom);

export default router;
