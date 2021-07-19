import express from 'express';
import { goodsPhotoController } from '../controllers/goods-photo.controller.js';
import { goodsController } from '../controllers/goods.controller.js';

const router = express.Router();

// router.post('/', (req, res) => {
//   const { body, params } = req;
//   console.log(body);
//   console.log(params);
// if (user) return res.json({ user });
// return res.status(401).json({ user: null, error: '자동 로그인 실패' });
// });

router.get('/', (req, res) => {
  const { body, params } = req;
  console.log(`body : ${body}`);
  console.log(`params : ${params}`);
});

router.get('/:goodsId', goodsController.findGoodsDetailByGoodsId);
router.post('/', goodsController.createGoods);

router.put('/', (req, res) => {
  const { body, params } = req;
  console.log(`body : ${body}`);
  console.log(`params : ${params}`);
});

router.delete('/', (req, res) => {
  const { body, params } = req;
  console.log(`body : ${body}`);
  console.log(`params : ${params}`);
});

export default router;
