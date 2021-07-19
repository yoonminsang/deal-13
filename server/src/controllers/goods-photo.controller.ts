import { Request, Response } from 'express';
import { goodsPhotoService } from '../services/goods-photo.service';

const createPhoto = async (req: Request, res: Response) => {
  try {
    const { goodsId, url } = req.body;
    await goodsPhotoService.createGoodsPhoto(Number(goodsId), url);
    res.status(200).json({
      result: '0',
      message: '이미지 등록 성공',
    });
  } catch (err) {
    res.status(500).json({
      result: '1',
      message: '이미지 등록 실패',
    });
  }
};

const deleteGoodsPhotos = async (req: Request, res: Response) => {
  try {
    const { goodsId, photos } = req.body;
    const data = await goodsPhotoService.deleteGoodsPhotos(
      Number(goodsId),
      photos,
    );
    res.status(200).json({
      result: '0',
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const goodsPhotoController = {
  createPhoto,
  deleteGoodsPhotos,
};
