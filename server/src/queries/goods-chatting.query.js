import db from '../db/index.js';
// 채팅방 생성
const insertChattingRoom = async (goodsId, sellerId, userId) => {
  const [check] = await db.query(`
    SELECT id AS roomId FROM chatting_room WHERE buyer_id = '${userId}' AND goods_id = ${goodsId} AND seller_id = '${sellerId}';
  `);
  if (check.length) {
    return {
      roomId: check[0].roomId,
      check: true,
    };
  } else {
    const result = await db.query(
      `INSERT INTO chatting_room(goods_id, seller_id, buyer_id, seller_read, buyer_read, seller_entrance, buyer_entrance) VALUES(${goodsId}, '${sellerId}', '${userId}', 1, 1, 1, 1);`,
    );
    if (result) {
      return {
        roomId: result[0].insertId,
      };
    }
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
// 채팅방 목록 조회, 상품 id (상품 상세에서 채팅 목록 보기)
const selectChattingRoomByGoodsId = async (goodsId, userId) => {
  const [result] = await db.query(
    `
    SELECT 
      r.id as room_id, 
      g.thumbnail, 
      r.buyer_id AS partner_id,
      (
        SELECT count(distinct m2.id) 
        FROM chatting_message m2
        WHERE m2.id > r.seller_read
        AND m2.user_id = '${userId}'
      ) AS chat_count,
      (
        SELECT m.content
        FROM chatting_message m
        WHERE m.room_id = r.id
        ORDER BY m.id DESC
        LIMIT 1
      ) AS last_content,
      (
        SELECT DATE_FORMAT(m.created,'%Y-%m-%d %H:%i:%S')
        FROM chatting_message m
        WHERE m.room_id = r.id
        ORDER BY m.id DESC
        LIMIT 1
      ) AS last_created
    FROM 
      chatting_room r, 
      goods g
    WHERE
      g.id = ${goodsId}
    AND
      r.goods_id = g.id
    AND
      r.seller_entrance > -1
    ORDER BY last_created DESC;
    `,
  );
  if (result) {
    return result;
  }
  return null;
};
// 채팅방 상세
const selectChattingRoomDetail = async (roomId, lastIndex, userId) => {
  const [result] = await db.query(`
    SELECT 
      r.id as room_id, 
      g.id as goods_id, 
      r.buyer_id, 
      r.seller_id, 
      g.thumbnail, 
      g.title, 
      g.sale_state, 
      g.price,
      r.seller_entrance,
      r.buyer_entrance
    FROM 
      chatting_room r, 
      goods g
    WHERE
      r.id = ${roomId}
    AND
      g.id = r.goods_id;
  `);
  if (result) {
    result[0].isSeller = userId === result[0].seller_id;
    if (result[0].isSeller && result[0].seller_entrance === -1) return null;
    if (!result[0].isSeller && result[0].buyer_entrance === -1) return null;
    if (lastIndex === 'undefined') {
      const [chattingList] = await db.query(`
      SELECT id, user_id, content
      FROM 
      chatting_message
      WHERE
      room_id = ${roomId}
      `);
      result[0].chattingList = chattingList;
      return result[0];
    } else {
      const [chattingList] = await db.query(`
        SELECT id, user_id, content
        FROM 
        chatting_message
        WHERE
        room_id = ${roomId}
        AND
        id > ${lastIndex}
      `);
      result[0].chattingList = chattingList;
      return result[0];
    }
  }
  return null;
};
// 채팅방 목록 조회, 유저 id (메뉴에서 채팅 목록 보기)
const selectChattingRoomByUserId = async (userId) => {
  const [result] = await db.query(
    `
    SELECT
      r.id as room_id, 
      g.thumbnail, 
      (
        SELECT IF(r2.buyer_id = '${userId}', r2.seller_id, r2.buyer_id)
        FROM chatting_room r2
        WHERE r2.id = r.id
      ) AS partner_id,
      (
    SELECT count(distinct m2.id)
        FROM chatting_message m2
        WHERE m2.id > IF(r.seller_id = '${userId}', r.seller_read, r.buyer_read)
        AND r.id = m2.room_id
        GROUP by r.id
      ) AS chat_count,
      (
        SELECT m.content
        FROM chatting_message m
        WHERE m.room_id = r.id
        ORDER BY m.id DESC
        LIMIT 1
      ) AS last_content,
      (
        SELECT DATE_FORMAT(m.created,'%Y-%m-%d %H:%i:%S')
        FROM chatting_message m
        WHERE m.room_id = r.id
        ORDER BY m.id DESC
        LIMIT 1
      ) AS last_created
    FROM 
      chatting_room r, 
      goods g
    WHERE
      (r.buyer_id = '${userId}' AND r.buyer_entrance > -1)
      OR
      (r.seller_id = '${userId}' AND r.seller_entrance > -1)
    GROUP BY r.id
    ORDER BY last_created DESC;
    `,
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
        buyer_entrance = IF(buyer_id = '${userId}', -1, buyer_entrance),
        seller_entrance = IF(seller_id = '${userId}', -1, seller_entrance) 
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
        r.id = ${roomId};
    `,
  );
  if (result) {
    return result;
  }
  return null;
};
export const goodsChattingQuery = {
  insertChattingRoom,
  insertChattingMessage,
  selectChattingRoomByGoodsId,
  selectChattingRoomByUserId,
  deleteChattingRoom,
  updateChattingMessage,
  selectChattingRoomDetail,
};
