import db from '../db/index.js';

const insertGoods = async ({
  title,
  content,
  categoryId,
  price,
  thumbnail,
  regionId,
  userId,
  urls,
}) => {
  const result = await db.query(
    `INSERT INTO goods(title, content, region_id, category_id, thumbnail, price, user_id) VALUES('${title}', '${content}', ${regionId}, ${categoryId}, ${thumbnail}, ${price}, '${userId}')`,
  );
  if (result) {
    const insertId = result[0].insertId;
    const urlQuery = urls.map((url) => `(${url}, ${insertId})`);
    const photoInsertResult = await db.query(
      `INSERT INTO goods_photo(url, goods_id) VALUES${urlQuery.join(',')}`,
    );
    if (photoInsertResult) {
      return true;
    }
  }
  return null;
};

const selectGoods = async (regionId, categoryId, lastIndex) => {
  const result = await db.query(
    `
    SELECT g.* FROM goods g
    JOIN goods g2 
    WHERE state = 0
    AND regionId = ${regionId === Infinity ? '0 or region_id > -1' : regionId}
    AND category_id = ${
      categoryId === Infinity ? '0 or category_id > -1' : categoryId
    }
    AND g2.id = ${lastIndex} 
    AND g2.updated < g.updated
    ORDER BY updated DESC
  `,
  );
  if (result.length) return result[0];
  else return null;
};

const selectGoodsByUserId = async (userId, lastIndex) => {
  const result = await db.query(
    `SELECT g.* FROM goods g
    JOIN goods g2 
    WHERE state = 0
    AND g2.id = ${lastIndex} 
    AND g2.updated < g.updated AND user_id = '${userId}' ORDER BY updated DESC`,
  );

  if (result.length) return result[0];
  return null;
};

// wish...
// const selectGoodsByUserId = async (userId, lastIndex) => {
//   const result = await db.query(
//     `SELECT g.* FROM goods g
//     JOIN goods g2
//     WHERE g2.id = ${lastIndex}
//     AND g2.updated < g.updated AND user_id = '${userId}' ORDER BY updated DESC`,
//   );

//   if (result.length) return result[0];
//   return null;
// };

const selectGoodsDetailByGoodsId = async (goodsId, userId) => {
  const result = await db.query(
    `SELECT g.*, CONCAT('[', GROUP_CONCAT(p.url), ']') AS urls, r.region, c.name as category FROM goods g, goods_photo p, region r, category c WHERE g.id = ${goodsId} AND g.state = 0 AND g.id = p.goods_id AND g.region_id = r.id AND g.category_id = c.id`,
  );
  if (result.length) {
    if (result[0][0].user_id !== userId) {
      await db.query(
        `UPDATE goods SET view_count = view_count + 1 WHERE id = ${result[0][0].id} AND state = 0`,
      );
      result[0][0].view_count += 1;
    }
    return result[0];
  }
  return null;
};

const updateGoods = async ({
  id,
  userId,
  title,
  content,
  price,
  categoryId,
  thumbnail,
  regionId,
}) => {
  const result = await db.query(
    `UPDATE goods SET title = '${title}', content = '${content}', category_id = ${categoryId}, price = ${price}, thumbnail = ${thumbnail}, region_id = ${regionId}, updated = CURRENT_TIMESTAMP WHERE id = ${id} AND user_id = '${userId}'`,
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

const deleteGoodsViewState = async (goodsId) => {
  const result = await db.query(
    `UPDATE goods SET view_state = 1 WHERE id = ${goodsId}`,
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
  deleteGoodsViewState,
};
