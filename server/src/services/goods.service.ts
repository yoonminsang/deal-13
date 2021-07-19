export const goodsService = {
  createGoods: ({
    title = '',
    content = '',
    categoryId = Infinity,
    price = Infinity,
    thumbnailId = Infinity,
    regionId = Infinity,
    userId,
  }) => `
    INSERT INTO goods(
      title,
      content,
      region_id,
      category_id,
      thumbnail_id,
      price, 
      user_id
    ) 
    VALUES(
      ${title}, 
      ${content}, 
      ${regionId},
      ${categoryId},
      ${thumbnailId},
      ${price},
      ${userId}
  `,
  findGoods: (regionId = Infinity, categoryId = Infinity) =>
    `SELECT * FROM goods WHERE 
      region_id = ${
        regionId === Infinity ? '0 or region_id > -1' : regionId
      } AND 
      category_id = ${
        categoryId === Infinity ? '0 or category_id > -1' : categoryId
      }
      ORDER BY created DESC
    `,
  findGoodsByUserId: (userId: string) =>
    `SELECT * FROM goods WHERE user_id = '${userId}' ORDER BY created DESC`,
  findGoodsDetailByGoodsId: (goodsId: number) =>
    `SELECT * FROM goods JOIN goods_photo ON goods_photo WHERE id = ${goodsId}`,
  updateGoods: ({
    title = '',
    content = '',
    categoryId = Infinity,
    price = Infinity,
    thumbnailId = Infinity,
    regionId = Infinity,
    goodsId,
    userId,
  }) =>
    `
      UPDATE goods SET 
       ${title.length ? `title = '${title}', ` : ''}
       ${content.length ? `content = '${content}', ` : ''}
       ${categoryId !== Infinity ? `category_id = ${categoryId}, ` : ''}
       ${price !== Infinity ? `price = ${price}, ` : ''}
       ${thumbnailId !== Infinity ? `thumbnail_id = '${thumbnailId}', ` : ''}
       ${regionId !== Infinity ? `region_id = ${regionId}, ` : ''}
      WHERE id = ${goodsId}
      AND user_id = '${userId}'
    `,
};
