import { goodsWishService } from '../services/goods-wish.service.js';

const createGoodsWish = async (req, res) => {
  try {
    const { goodsId } = req.body;
    const data = await goodsWishService.createGoodsWish(
      Number(goodsId),
      req.user.id,
    );
    res.status(200).json({
      result: '0',
      message: '관심 상품 등록 성공',
      ...data,
    });
  } catch (err) {
    res.status(500).json({
      result: '1',
      message: '관심 상품 등록 실패',
    });
  }
};

const deleteGoodsWish = async (req, res) => {
  try {
    const { goodsId } = req.body;
    const data = await goodsWishService.deleteGoodsWish(
      Number(goodsId),
      req.user.id,
    );
    res.status(200).json({
      result: '0',
      message: '관심 상품 삭제 성공',
      ...data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const goodsWishController = {
  createGoodsWish,
  deleteGoodsWish,
};
