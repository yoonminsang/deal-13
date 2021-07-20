import { goodsWishService } from '../services/goods-wish.service.js';

const createGoodsWish = async (req, res) => {
  try {
    const { goodsId, userId } = req.body;
    await goodsWishService.createGoodsWish(Number(goodsId), userId);
    res.status(200).json({
      result: '0',
      message: '관심 상품 등록 성공',
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
    const { goodsId, userId } = req.body;
    const data = await goodsWishService.deleteGoodsWish(
      Number(goodsId),
      userId,
    );
    res.status(200).json({
      result: '0',
      message: '관심 상품 삭제 성공',
    });
  } catch (err) {
    console.log(err);
  }
};

export const goodsWishController = {
  createGoodsWish,
  deleteGoodsWish,
};
