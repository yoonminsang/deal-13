import { goods } from '../models/goods';
import { goodsQuery } from '../queries/goods.query';

const createGoods = async (body: goods) => {
  const data = {
    ...body,
  };
  if (!data.title) return null;
  if (!data.regionId && data.regionId !== 0) return null;
  if (!data.userId) return null;
  if (!data.categoryId && data.categoryId !== 0) return null;
  if (!data.content) data.content = '';
  if (!data.price) data.price = 0;
  if (!data.thumbnailId && data.thumbnailId !== 0) data.thumbnailId = null;
  const result = await goodsQuery.insertGoods(data);
  return result;
};

const findGoods = async (regionId: number, categoryId: number) => {
  if (!regionId && regionId !== 0) regionId = Infinity;
  if (!categoryId && categoryId !== 0) categoryId = Infinity;
  const result = await goodsQuery.selectGoods(regionId, categoryId);
  return result;
};

const findGoodsByUserId = async (userId: string) => {
  if (!userId) return null;
  const result = await goodsQuery.selectGoodsByUserId(userId);
  return result;
};

const findGoodsDetailByGoodsId = async (goodsId: number) => {
  if (!goodsId) return null;
  const result = await goodsQuery.selectGoodsDetailByGoodsId(goodsId);
  return result;
};

const updateGoods = async (body: goods) => {
  const data = {
    ...body,
  };
  if (!data.title) return null;
  if (!data.regionId && data.regionId !== 0) return null;
  if (!data.userId) return null;
  if (!data.categoryId && data.categoryId !== 0) return null;
  if (!data.content) data.content = '';
  if (!data.price) data.price = 0;
  if (!data.thumbnailId && data.thumbnailId !== 0) data.thumbnailId = null;
  const result = await goodsQuery.updateGoods(data);
  return result;
};

const updateGoodsSaleState = async (goodsId: number, state: number) => {
  if (!goodsId && goodsId !== 0) return null;
  if (!state && state !== 0) return null;
  const result = await goodsQuery.updateGoodsSaleState(goodsId, state);
  return result;
};

const updateGoodsViewState = async (goodsId: number, state: number) => {
  if (!goodsId && goodsId !== 0) return null;
  if (!state && state !== 0) return null;
  const result = await goodsQuery.updateGoodsViewState(goodsId, state);
  return result;
};

export const goodsService = {
  createGoods,
  findGoods,
  findGoodsByUserId,
  findGoodsDetailByGoodsId,
  updateGoods,
  updateGoodsSaleState,
  updateGoodsViewState,
};
