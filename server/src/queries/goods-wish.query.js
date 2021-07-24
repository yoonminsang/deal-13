import db from '../db/index.js';

const insertGoodsWish = async (goodsId, userId) => {
  const result = await db.query(
    `INSERT INTO goods_wish(goods_id, user_id) VALUES(${goodsId}, '${userId}');`,
  );
  if (result) {
    const [data] = await db.query(
      `SELECT count(w.id) AS wish_count FROM goods_wish w WHERE w.goods_id = ${goodsId};`,
    );
    return {
      data: data[0],
    };
  }
  return null;
};

const deleteGoodsWish = async (goodsId, userId) => {
  const result = await db.query(
    `DELETE from goods_wish WHERE goods_id = ${goodsId} AND user_id = '${userId}';`,
  );
  if (result) {
    const [data] = await db.query(
      `SELECT count(w.id) AS wish_count FROM goods_wish w WHERE w.goods_id = ${goodsId};`,
    );
    return {
      data: data[0],
    };
  }
  return null;
};

export const goodsWishQuery = {
  insertGoodsWish,
  deleteGoodsWish,
};
