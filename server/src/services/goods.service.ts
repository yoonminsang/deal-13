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
};
