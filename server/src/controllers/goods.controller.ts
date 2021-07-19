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

export const goodsController = {
  createGoods,
  findGoods,
};
