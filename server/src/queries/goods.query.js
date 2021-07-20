import db from '../db/index.js';

const insertGoods = async ({
  title,
  regionId,
  categoryId,
  userId,
  thumbnail,
  price,
  content,
  urls = [],
}) => {
  const result = await db.query(
    `INSERT INTO goods(title, content, region_id, category_id, thumbnail, price, user_id) VALUES('${title}', '${content}', ${regionId}, ${categoryId}, '${thumbnail}', ${price}, '${userId}')`,
  );
  if (result) {
    const insertId = result[0].insertId;
    const urlQuery = urls.map((url) => `('${url}', ${insertId})`);
    if (urlQuery.length > 0) {
      const photoInsertResult = await db.query(
        `INSERT INTO goods_photo(url, goods_id) VALUES${urlQuery.join(',')}`,
      );
      if (photoInsertResult) {
        return true;
      }
    }
  }
  return null;
};

const selectGoods = async (regionId, categoryId, userId, lastIndex) => {
  const result = await db.query(
    `
    SELECT g.*,
      (SELECT count(distinct w.id) FROM goods_wish w WHERE w.id = g.id) as wish_count
      ${
        userId.length > 0
          ? `, (SELECT count(distinct w2.id) FROM goods_wish w2 WHERE w2.user_id = '${userId}' AND w2.goods_id = g.id) as isWish `
          : ''
      }
    FROM goods g
    JOIN goods g2
    WHERE g.view_state = 0
    AND g.region_id = ${
      regionId === Infinity ? '0 or g.region_id > -1' : regionId
    }
    AND g.category_id = ${
      categoryId === Infinity ? '0 or g.category_id > -1' : categoryId
    }
    AND g2.id = ${lastIndex} 
    AND g2.updated <= g.updated
    ORDER BY updated DESC
    LIMIT 20;
  `,
  );
  if (result.length) {
    result[0].forEach((v) =>
      v.isWish > 0 ? (v.isWish = true) : (v.isWish = false),
    );
    return result[0];
  }
  return null;
};

const selectGoodsByUserId = async (userId) => {
  const result = await db.query(
    `
    SELECT 
      g.*, 
      count(w.id) as wish_count, 
    FROM goods g
    LEFT JOIN goods_wish w ON w.goods_id = g.id
    WHERE g.view_state = 0
    AND g.user_id = '${userId}'
    GROUP BY g.id
    ORDER BY updated DESC
  `,
  );
  if (result.length) {
    return result[0];
  }
  return null;
};

const selectGoodsByWish = async (userId) => {
  const [result] = await db.query(
    `
    SELECT 
      g.*, 
      count(w.id) as wish_count
    FROM goods g
    LEFT JOIN goods_wish w ON w.goods_id = g.id
    WHERE g.view_state = 0
    AND w.user_id = '${userId}'
    AND g.id = w.goods_id
    GROUP BY g.id
    ORDER BY updated DESC
  `,
  );

  if (result.length) {
    return result[0];
  }
  return null;
};

const selectGoodsDetail = async (goodsId, userId) => {
  const [result] = await db.query(
    `SELECT g.*, count(distinct w.id) as wish_count, CONCAT('[', GROUP_CONCAT(p.url), ']') AS urls, r.region, c.name as category, instr(g.user_id, '${userId}') as isAuthor, (SELECT count(w2.id) FROM goods_wish w2 WHERE w2.user_id = '${userId}') as isWish FROM goods g, goods_photo p, region r, category c, goods_wish w WHERE g.id = ${goodsId} AND g.view_state = 0 AND g.id = p.goods_id AND g.region_id = r.id AND g.category_id = c.id AND w.goods_id = g.id`,
  );
  if (result.length) {
    if (result[0].isAuthor !== 0) {
      result[0].isAuthor = true;
    } else {
      result[0].isAuthor = false;
      result[0].view_count += 1;
      await db.query(
        `UPDATE goods SET view_count = view_count + 1 WHERE id = ${result[0].id}`,
      );
    }
    if (result[0].isWish) result[0].isWish = true;
    else result[0].isWish = false;
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
    `UPDATE goods SET title = '${title}', content = '${content}', category_id = ${categoryId}, price = ${price}, thumbnail = '${thumbnail}', region_id = ${regionId}, updated = CURRENT_TIMESTAMP WHERE id = ${id} AND user_id = '${userId}'`,
  );
  if (result.length) return result;
  else return null;
};

const updateGoodsSaleState = async (goodsId, userId, state) => {
  const result = await db.query(
    `UPDATE goods SET sale_state = ${state} WHERE id = ${goodsId} AND user_id = '${userId}'`,
  );
  if (result.length) return result;
  else return null;
};

const deleteGoodsViewState = async (goodsId, userId) => {
  const result = await db.query(
    `UPDATE goods SET view_state = 1 WHERE id = ${goodsId} AND user_id = '${userId}'`,
  );
  if (result.length) return result;
  else return null;
};

export const goodsQuery = {
  insertGoods,
  selectGoods,
  selectGoodsByUserId,
  selectGoodsByWish,
  selectGoodsDetail,
  updateGoods,
  updateGoodsSaleState,
  deleteGoodsViewState,
};