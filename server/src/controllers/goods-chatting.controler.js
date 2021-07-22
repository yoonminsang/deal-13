import { goodChattingService } from '../services/goods-chatting.service.js';

const createChattingRoom = async (req, res) => {
  const data = req.body;
  data.userId = req.user.id;
  const result = await goodChattingService.createChattingRoom(data);
  if (result) {
    res.status(200).json({
      result: 0,
      message: '채팅방 등록 성공',
    });
  } else {
    res.status(500).json({
      result: 1,
      message: '채팅방 등록 실패',
    });
  }
};
const selectChattingRoom = async (req, res) => {
  const data = req.query;
  data.userId = req.user.id;
  const result = await goodChattingService.selectChattingRoom(data);
  if (result) {
    res.status(200).json({
      result: 0,
      message: '',
    });
  } else {
    res.status(500).json({
      result: 1,
      message: '',
    });
  }
};
const deleteChattingRoom = async (req, res) => {
  const data = req.body;
  data.userId = req.user.id;
  const result = await goodChattingService.deleteChattingRoom(data);
  if (result) {
    res.status(200).json({
      result: 0,
      message: '',
    });
  } else {
    res.status(500).json({
      result: 1,
      message: '',
    });
  }
};
const createChattingMessage = async (req, res) => {
  const data = req.body;
  data.userId = req.user.id;
  const result = await goodChattingService.createChattingMessage(data);
  if (result) {
    res.status(200).json({
      result: 0,
      message: '',
    });
  } else {
    res.status(500).json({
      result: 1,
      message: '',
    });
  }
};
const updateChattingMessage = async (req, res) => {
  const data = req.body;
  data.userId = req.user.id;
  const result = await goodChattingService.updateChattingMessage(data);
  if (result) {
    res.status(200).json({
      result: 0,
      message: '',
    });
  } else {
    res.status(500).json({
      result: 1,
      message: '',
    });
  }
};
const selectChattingRoomDetail = async (req, res) => {
  const data = req.query;
  data.userId = req.user.id;
  const result = await goodChattingService.selectChattingRoomDetail(data);
  if (result) {
    res.status(200).json({
      result: 0,
      message: '',
    });
  } else {
    res.status(500).json({
      result: 1,
      message: '',
    });
  }
};

export const goodsChattingController = {
  createChattingRoom,
  selectChattingRoom,
  deleteChattingRoom,
  createChattingMessage,
  updateChattingMessage,
  selectChattingRoomDetail,
};
