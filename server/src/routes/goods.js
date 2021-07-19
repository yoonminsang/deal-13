import express from 'express';
import { goodsPhotoController } from '../controllers/goods-photo.controller.js';
import { goodsController } from '../controllers/goods.controller.js';
import passport from 'passport';

const router = express.Router();

// router.post('/', (req, res) => {
//   const { body, params } = req;
//   console.log(body);
//   console.log(params);
// if (user) return res.json({ user });
// return res.status(401).json({ user: null, error: '자동 로그인 실패' });
// });

// router.get('/', (req, res) => {
//   const { body, params } = req;
//   console.log(`body : ${body}`);
//   console.log(`params : ${params}`);
//   console.log(req.user);
//   console.log('1111');
// });

router.get('/:goodsId', goodsController.findGoodsDetailByGoodsId);
router.delete('/:goodsId', goodsController.deleteGoodsViewState);
router.put('/', goodsController.updateGoods);
router.put('/:goodsId/:state', goodsController.updateGoodsSaleState);
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
