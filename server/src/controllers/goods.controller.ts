import { Request, Response } from 'express';
import { goodsService } from '../services/goods.service';

const createGoods = async (req: Request, res: Response) => {
  try {
    await goodsService.createGoods(req.body);
    res.status(200).json({
      result: '0',
      message: '상품 등록 성공',
    });
  } catch (err) {
    res.status(500).json({
      result: '1',
      message: '상품 등록 실패',
    });
  }
};

const findGoods = async (req: Request, res: Response) => {
  try {
    const { regionId, categoryId } = req.body;
    const data = await goodsService.findGoods(
      Number(regionId),
      Number(categoryId),
    );
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

const findGoodsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const data = await goodsService.findGoodsByUserId(userId);
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

const findGoodsDetailByGoodsId = async (req: Request, res: Response) => {
  try {
    const { goodsId } = req.body;
    const data = await goodsService.findGoodsDetailByGoodsId(Number(goodsId));
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

const updateGoods = async (req: Request, res: Response) => {
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

const updateGoodsSaleState = async (req: Request, res: Response) => {
  try {
    const { goodsId, state } = req.body;
    await goodsService.updateGoodsSaleState(goodsId, state);
    res.status(200).json({
      result: '0',
      message: '상태 변경 완료',
    });
  } catch (err) {
    console.log(err);
  }
};

const updateGoodsViewState = async (req: Request, res: Response) => {
  try {
    const { goodsId, state } = req.body;
    await goodsService.updateGoodsViewState(goodsId, state);
    res.status(200).json({
      result: '0',
      message: '상태 변경 완료',
    });
  } catch (err) {
    console.log(err);
  }
};

export const goodsController = {
  createGoods,
  findGoods,
  findGoodsByUserId,
  findGoodsDetailByGoodsId,
  updateGoods,
  updateGoodsSaleState,
  updateGoodsViewState,
};
