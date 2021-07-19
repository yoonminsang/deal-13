import { goodsQuery } from '../queries/goods.query.js';

const createGoods = async (body) => {
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

const findGoods = async (regionId, categoryId, lastIndex) => {
  if (!regionId && regionId !== 0) regionId = Infinity;
  if (!categoryId && categoryId !== 0) categoryId = Infinity;
  if (!lastIndex && lastIndex !== 0) lastIndex = 0;
  const result = await goodsQuery.selectGoods(regionId, categoryId, lastIndex);
  return result;
};

const findGoodsByUserId = async (userId, lastIndex) => {
  if (!userId) return null;
  if (!lastIndex && lastIndex !== 0) lastIndex = 0;
  const result = await goodsQuery.selectGoodsByUserId(userId, lastIndex);
  return result;
};

const findGoodsDetailByGoodsId = async (goodsId, userId) => {
  if (!goodsId) return null;
  if (!userId) return null;
  const result = await goodsQuery.selectGoodsDetailByGoodsId(goodsId, userId);
  return result;
};

const updateGoods = async (body) => {
  const data = {
    ...body,
  };
  if (!data.id) return null;
  if (!data.userId) return null;
  if (!data.title) return null;
  if (!data.content) data.content = '';
  if (!data.price) data.price = 0;
  if (!data.categoryId && data.categoryId !== 0) return null;
  if (!data.thumbnail || data.thumbnail.length === 0) return null;
  if (!data.regionId && data.regionId !== 0) return null;
  const result = await goodsQuery.updateGoods(data);
  return result;
};

const updateGoodsSaleState = async (goodsId, state) => {
  if (!goodsId && goodsId !== 0) return null;
  if (!state && state !== 0) return null;
  const result = await goodsQuery.updateGoodsSaleState(goodsId, state);
  return result;
};

const deleteGoodsViewState = async (goodsId) => {
  if (!goodsId && goodsId !== 0) return null;
  const result = await goodsQuery.deleteGoodsViewState(goodsId);
  return result;
};

export const goodsService = {
  createGoods,
  findGoods,
  findGoodsByUserId,
  findGoodsDetailByGoodsId,
  updateGoods,
  updateGoodsSaleState,
  deleteGoodsViewState,
};
