import { goodsPhotoQuery } from '../queries/goods-photo.query.js';

const createGoodsPhoto = async (goodsId, url) => {
  if (!goodsId && goodsId !== 0) return null;
  if (!url && url.length === 0) return null;
  const result = await goodsPhotoQuery.insertGoodsPhoto(goodsId, url);
  return result;
};

const deleteGoodsPhotos = async (goodsId, photos) => {
  if (!goodsId && goodsId !== 0) return null;
  if (!photos) return null;
  const result = await goodsPhotoQuery.updateGoodsPhotoState(goodsId, photos);
  return result;
};

export const goodsPhotoService = {
  createGoodsPhoto,
  deleteGoodsPhotos,
};
