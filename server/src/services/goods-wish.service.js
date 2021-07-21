import { goodsWishQuery } from '../queries/goods-wish.query.js';

const createGoodsWish = async (goodsId, userId) => {
  if (!goodsId && goodsId !== 0) return null;
  if (!userId) return null;
  const result = await goodsWishQuery.insertGoodsWish(goodsId, userId);
  return result;
};

const deleteGoodsWish = async (goodsId, userId) => {
  if (!goodsId && goodsId !== 0) return null;
  if (!userId) return null;
  const result = await goodsWishQuery.deleteGoodsWish(goodsId, userId);
  return result;
};

export const goodsWishService = {
  createGoodsWish,
  deleteGoodsWish,
};
