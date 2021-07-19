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

export const goodsController = {
  createGoods,
};
