import mongoose from 'mongoose';

export interface ProductImageInterface {
  product_id: mongoose.Types.ObjectId;
  image_url: string;
  type: 'PRIMARY' | 'EXTRA';
}
