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

// 채팅 메세지 생성
const insertChattingMessage = async (content, roomId, userId) => {
  const result = await db.query(
    `INSERT INTO chatting_message(content, room_id, user_id) VALUES('${content}', ${roomId}, '${userId}');`,
  );
  if (result) {
    return result;
  }
  return null;
};

export const WishQuery = {
  insertChattingRoom,
  insertChattingMessage,
};
