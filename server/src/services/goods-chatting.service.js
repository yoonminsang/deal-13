import { goodsChattingQuery } from '../queries/goods-chatting.query.js';

const createChattingRoom = async (data) => {
  const { goodsId, sellerId, userId } = data;
  if (!goodsId && goodsId !== 0) return null;
  if (!sellerId) return null;
  if (!userId) return null;
  const result = await goodsChattingQuery.insertChattingRoom(
    goodsId,
    sellerId,
    userId,
  );
  return result;
};

const selectChattingRoom = async (data) => {
  const { userId, goodsId } = data;
  if (!goodsId && !userId) return null;

  const result = await (goodsId
    ? goodsChattingQuery.selectChattingRoomByGoodsId(goodsId, userId)
    : goodsChattingQuery.selectChattingRoomByUserId(userId));
  return result;
};

const deleteChattingRoom = async (data) => {
  const { roomId, userId } = data;
  if (!roomId) return null;
  if (!userId) return null;
  const result = await goodsChattingQuery.deleteChattingRoom(roomId, userId);
  return result;
};

const createChattingMessage = async (data) => {
  const { content, roomId, userId } = data;
  if (!content || content.length === 0) return null;
  if (!roomId) return null;
  if (!userId) return null;
  const result = await goodsChattingQuery.insertChattingMessage(
    content,
    roomId,
    userId,
  );
  if (result) updateChattingMessage(data);
  return result;
};

const updateChattingMessage = async (data) => {
  const { roomId, userId } = data;
  if (!roomId) return null;
  if (!userId) return null;
  const result = await goodsChattingQuery.updateChattingMessage(roomId, userId);
  return result;
};

const selectChattingRoomDetail = async (data) => {
  const { roomId, lastIndex = 0, userId } = data;
  if (!roomId) return null;
  if (!userId) return null;
  const result = await goodsChattingQuery.selectChattingRoomDetail(
    roomId,
    lastIndex,
    userId,
  );
  if (result) goodsChattingQuery.updateChattingMessage(roomId, userId);
  return result;
};

export const goodChattingService = {
  createChattingRoom,
  selectChattingRoom,
  deleteChattingRoom,
  createChattingMessage,
  updateChattingMessage,
  selectChattingRoomDetail,
};
