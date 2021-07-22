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

// 채팅방 나가기
const deleteChattingRoom = async (roomId, userId) => {
  const result = await db.query(
    `
    UPDATE chatting_room 
      SET 
        buyer_entrance = IF(buyer_id = '${userId}', 1, 0),
        seller_entrance = IF(seller_id = '${userId}', 1, 0) 
      WHERE 
        id = ${roomId};`,
  );
  if (result) {
    return result;
  }
  return null;
};

// 채팅방 메세지 전송 또는 입장 시, 읽은 메세지 갱신
const updateChattingMessage = async (roomId, userId) => {
  const result = await db.query(
    `
    UPDATE chatting_room r
      SET 
        r.buyer_read = IF(r.buyer_id = '${userId}', (SELECT m.id from chatting_message m WHERE m.room_id = ${roomId} ORDER BY m.id DESC LIMIT 1), r.buyer_read),
        r.seller_read = IF(r.seller_id = '${userId}', (SELECT m.id from chatting_message m WHERE m.room_id = ${roomId} ORDER BY m.id DESC LIMIT 1), r.seller_read) 
      WHERE 
        r.id = ${roomId};`,
  );
  if (result) {
    return result;
  }
  return null;
};

export const WishQuery = {
  insertChattingRoom,
  insertChattingMessage,
  deleteChattingRoom,
  updateChattingMessage,
};
