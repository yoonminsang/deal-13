import { goodsService } from '../services/goods.service.js';

const createGoods = async (req, res) => {
  try {
    req.body.userId = req.user.id;
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
    const { regionId, categoryId, lastIndex } = req.query;
    let data = null;
    data = await goodsService.findGoods(
      Number(regionId),
      Number(categoryId),
      req.user.id,
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
    const data = await goodsService.findGoodsByUserId(req.user.id);
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

const findGoodsByUserWish = async (req, res) => {
  try {
    const data = await goodsService.findGoodsByUserWish(req.user.id);
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

const findGoodsDetail = async (req, res) => {
  try {
    const { goodsId } = req.query;
    const data = await goodsService.findGoodsDetail(
      Number(goodsId),
      req.user.id,
    );
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateGoods = async (req, res) => {
  req.body.userId = req.user.id;
  try {
    req.body.userId = req.user.id;
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
    const { goodsId, state } = req.body;
    await goodsService.updateGoodsSaleState(goodsId, req.user.id, state);
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
    const { goodsId } = req.body;
    await goodsService.deleteGoodsViewState(goodsId, req.user.id);
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
  findGoodsByUserWish,
  findGoodsDetail,
  updateGoods,
  updateGoodsSaleState,
  deleteGoodsViewState,
};
