import { goods } from '../models/goods';

export const goodsService = {
  createGoods: ({
    title,
    content,
    categoryId,
    price,
    thumbnailId,
    regionId,
    userId,
  }: goods) => `
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
  findGoods: (regionId: number, categoryId: number) =>
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
    id,
    title,
    content,
    categoryId,
    price,
    thumbnailId,
    regionId,
    userId,
  }: goods) =>
    `
      UPDATE goods SET 
       title = '${title}',
       content = '${content}',
       category_id = ${categoryId},
       price = ${price},
       thumbnail_id = ${thumbnailId}
       region_id = ${regionId},
      WHERE id = ${id},
      AND user_id = '${userId}'
    `,
  updateGoodsSaleState: (goodsId: number, state: number) =>
    `UPDATE goods SET sale_state = ${state} WHERE id = ${goodsId}`,
  updateGoodsViewState: (goodsId: number, state: number) =>
    `UPDATE goods SET view_state = ${state} WHERE id = ${goodsId}`,
};
