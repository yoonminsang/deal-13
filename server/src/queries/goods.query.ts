import db from '../db/index.js';
import { goods } from '../models/goods';

const insertGoods = async ({
  title,
  content,
  categoryId,
  price,
  thumbnailId,
  regionId,
  userId,
}: goods) => {
  const result = await db.query(
    `INSERT INTO goods(title, content, region_id, category_id, thumbnail_id, price, user_id) VALUES(${title}, ${content}, ${regionId}, ${categoryId}, ${thumbnailId}, ${price}, ${userId}`,
  );
  if (result) return result;
  else return null;
};

const selectGoods = async (regionId: number, categoryId: number) => {
  const result = await db.query(
    `SELECT * FROM goods WHERE 
    region_id = ${regionId}
    AND 
    category_id = ${
      categoryId === Infinity ? '0 or category_id > -1' : categoryId
    }
    ORDER BY created DESC
  `,
  );
  if (result?.length) return result;
  else return null;
};

const selectGoodsByUserId = async (userId: string) => {
  const result = await db.query(
    `SELECT * FROM goods WHERE user_id = '${userId}' ORDER BY created DESC`,
  );

  if (result?.length) return result;
  else return null;
};

const selectGoodsDetailByGoodsId = async (goodsId: number) => {
  const result = await db.query(
    `SELECT * FROM goods JOIN goods_photo ON goods_photo WHERE id = ${goodsId}`,
  );
  if (result?.length) return result;
  else return null;
};

const updateGoods = async ({
  id,
  title,
  content,
  categoryId,
  price,
  thumbnailId,
  regionId,
  userId,
}: goods) => {
  const result = await db.query(
    `UPDATE goods SET title = '${title}', content = '${content}', category_id = ${categoryId}, price = ${price}, thumbnail_id = ${thumbnailId}, region_id = ${regionId}, WHERE id = ${id}, AND user_id = '${userId}'`,
  );
  if (result?.length) return result;
  else return null;
};

const updateGoodsSaleState = async (goodsId: number, state: number) => {
  const result = await db.query(
    `UPDATE goods SET sale_state = ${state} WHERE id = ${goodsId}`,
  );
  if (result?.length) return result;
  else return null;
};

const updateGoodsViewState = async (goodsId: number, state: number) => {
  const result = await db.query(
    `UPDATE goods SET view_state = ${state} WHERE id = ${goodsId}`,
  );
  if (result?.length) return result;
  else return null;
};

export const goodsQuery = {
  insertGoods,
  selectGoods,
  selectGoodsByUserId,
  selectGoodsDetailByGoodsId,
  updateGoods,
  updateGoodsSaleState,
  updateGoodsViewState,
};
