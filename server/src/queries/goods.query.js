import db from '../db/index.js';

const insertGoods = async ({
  title,
  content,
  categoryId,
  price,
  thumbnailId,
  regionId,
  userId,
  urls,
}) => {
  const result = await db.query(
    `INSERT INTO goods(title, content, region_id, category_id, thumbnail_id, price, user_id) VALUES('${title}', '${content}', ${regionId}, ${categoryId}, ${thumbnailId}, ${price}, '${userId}')`,
  );
  if (result) {
    const insertId = result[0].insertId;

    return result;
  } else return null;
};

const selectGoods = async (regionId, categoryId) => {
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
  if (result.length) return result;
  else return null;
};

const selectGoodsByUserId = async (userId) => {
  const result = await db.query(
    `SELECT * FROM goods WHERE user_id = '${userId}' ORDER BY created DESC`,
  );

  if (result.length) return result;
  else return null;
};

const selectGoodsDetailByGoodsId = async (goodsId) => {
  const result = await db.query(
    `SELECT g.*, CONCAT('[', GROUP_CONCAT(p.url), ']') AS urls, r.region, c.name as category FROM goods g, goods_photo p, regions r, category c WHERE g.id = ${goodsId} AND g.id = p.goods_id AND g.region_id = r.id AND g.category_id = c.id`,
  );
  console.log(result[0]);
  if (result.length) return result[0];
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
}) => {
  const result = await db.query(
    `UPDATE goods SET title = '${title}', content = '${content}', category_id = ${categoryId}, price = ${price}, thumbnail_id = ${thumbnailId}, region_id = ${regionId}, WHERE id = ${id}, AND user_id = '${userId}'`,
  );
  if (result.length) return result;
  else return null;
};

const updateGoodsSaleState = async (goodsId, state) => {
  const result = await db.query(
    `UPDATE goods SET sale_state = ${state} WHERE id = ${goodsId}`,
  );
  if (result.length) return result;
  else return null;
};

const updateGoodsViewState = async (goodsId, state) => {
  const result = await db.query(
    `UPDATE goods SET view_state = ${state} WHERE id = ${goodsId}`,
  );
  if (result.length) return result;
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
