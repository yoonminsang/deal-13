import db from '../db/index.js';

const insertGoodsPhoto = async (goodsId, url) => {
  // const result = await db.query(
  //   `INSERT INTO photo(goods_id, url) VALUES(${goodsId}, ${url})`,
  // );
  // db.

  const result = db.query(
    `INSERT INTO photo(goods_id, url) VALUES(${goodsId}, ${url})`,
    function (err, result) {
      if (err) throw err;
      console.log(result);
      return {
        id: result.insertId,
        url: result.url,
      };
      // {
      //   id: 3,
      //   url: https://...
      // }
      // urls: [
      //   3,4,5,6
      // ]
      // response.writeHead(302, {Location: `/?id=${result.insertId}`});
      // response.end();
    },
  );
  if (result) return result;
  else return null;
};

const updateGoodsPhotoState = async (goodsId, photos) => {
  const result = await db.query(
    `UPDATE photo SET state = 1 WHERE goods_id = ${goodsId} AND id NOT IN(${photos})`,
  );
  if (result.length) return result;
  else return null;
};

export const goodsPhotoQuery = {
  insertGoodsPhoto,
  updateGoodsPhotoState,
};
