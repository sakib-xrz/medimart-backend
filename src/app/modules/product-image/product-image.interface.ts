import mongoose from 'mongoose';

export interface ProductImageInterface {
  product_id: mongoose.Types.ObjectId;
  public_id: string;
  image_url: string;
  type: 'PRIMARY' | 'EXTRA';
}
