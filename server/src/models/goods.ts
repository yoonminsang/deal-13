import { goodsPhoto } from './goods-photo';

export interface goods {
  id?: number;
  title?: string;
  content?: string;
  price?: number;
  thumbnailId?: number;
  userId?: string;
  regionId?: number;
  categoryId?: number;
}
