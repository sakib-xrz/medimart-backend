import { ProductImageInterface } from '../product-image/product-image.interface';

type CategoryType =
  | 'Pain Relief'
  | 'Antibiotics'
  | 'Cold & Flu'
  | 'Digestive Health'
  | 'Allergy & Asthma'
  | 'Diabetes Care'
  | 'Cardiovascular Health'
  | 'Skin Care & Dermatology'
  | 'Mental Health & Neurology'
  | "Women's Health"
  | 'Vitamins & Supplements'
  | 'Eye & Ear Care'
  | 'Baby & Child Health'
  | 'First Aid & Wound Care';

export interface ProductInterface {
  name: string;
  description: string;
  category: CategoryType;
  images: ProductImageInterface[];
  price: number;
  discount: number;
  discount_type: 'PERCENTAGE' | 'FLAT';
  stock: number;
  requires_prescription: boolean;
  manufacturer_details: string;
  expiry_date: string;
  is_deleted: boolean;
}
