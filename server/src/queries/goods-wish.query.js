import db from '../db/index.js';

const insertGoodsWish = async (goodsId, userId) => {
  const result = db.query(
    `INSERT INTO goods_wish(goods_id, user_id) VALUES(${goodsId}, '${userId}')`,
  );
  if (result) return result;
  else return null;
};

const deleteGoodsWish = async (goodsId, userId) => {
  const result = await db.query(
    `DELETE from goods_wish WHERE goods_id = ${goodsId} AND user_id = '${userId}'`,
  );
  if (result.length) return result;
  else return null;
};

export const goodsWishQuery = {
  insertGoodsWish,
  deleteGoodsWish,
};
