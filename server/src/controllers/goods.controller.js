import { goodsService } from '../services/goods.service.js';

const createGoods = async (req, res) => {
  try {
    await goodsService.createGoods(req.body);
    res.status(200).json({
      result: '0',
      message: '상품 등록 성공',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: '1',
      message: '상품 등록 실패',
    });
  }
};

const findGoods = async (req, res) => {
  try {
    const { regionId, categoryId, userId, lastIndex } = req.query;
    let data = null;
    data = await goodsService.findGoods(
      Number(regionId),
      Number(categoryId),
      userId,
      Number(lastIndex),
    );
    res.status(200).json({
      result: '0',
      data,
      isLast: data.length < 20,
    });
  } catch (err) {
    console.log(err);
  }
};

const findGoodsByUserId = async (req, res) => {
  try {
    const { userId, lastIndex } = req.params;
    const data = await goodsService.findGoodsByUserId(
      userId,
      Number(lastIndex),
    );
    res.status(200).json({
      result: '0',
      data,
      isLast: data.length < 20,
    });
  } catch (err) {
    console.log(err);
  }
};

const findGoodsDetail = async (req, res) => {
  try {
    const { goodsId, userId } = req.query;
    const data = await goodsService.findGoodsDetail(Number(goodsId), userId);
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateGoods = async (req, res) => {
  try {
    await goodsService.updateGoods(req.body);
    res.status(200).json({
      result: '0',
      message: '상품 수정 성공',
    });
  } catch (err) {
    console.log(err);
  }
};

const updateGoodsSaleState = async (req, res) => {
  try {
    const { goodsId, userId, state } = req.body;
    await goodsService.updateGoodsSaleState(goodsId, userId, state);
    res.status(200).json({
      result: '0',
      message: '상태 변경 완료',
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteGoodsViewState = async (req, res) => {
  try {
    const { goodsId, userId } = req.body;
    await goodsService.deleteGoodsViewState(goodsId, userId);
    res.status(200).json({
      result: '0',
      message: '삭제 완료',
    });
  } catch (err) {
    console.log(err);
  }
};

export const goodsController = {
  createGoods,
  findGoods,
  findGoodsByUserId,
  findGoodsDetail,
  updateGoods,
  updateGoodsSaleState,
  deleteGoodsViewState,
};
