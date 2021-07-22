import db from '../db/index.js';

// 채팅방 생성
const insertChattingRoom = async (Id, sellerId, buyerId) => {
  const result = await db.query(
    `INSERT INTO chatting_room(_id, seller_id, buyer_id, seller_entrance, buyer_entrance) VALUES(${Id}, '${sellerId}', '${buyerId}', 0, 0);`,
  );
  if (result) {
    return result;
  }
  return null;
};

export const WishQuery = {
  insertChattingRoom,
};
