type CategoryType =
  | 'Supplements'
  | 'First Aid'
  | "Women's Health"
  | 'Pain Relief'
  | 'Skin Care'
  | 'Digestive Health';

export interface ProductInterface {
  name: string;
  slug: string;
  price: number;
  category: CategoryType;
  category_slug: string;
  dosage?: string;
  form?: string;
  pack_size?: string;
  manufacturer: string;
  description: string;
  requires_prescription: boolean;
  discount: number;
  discount_type: 'PERCENTAGE' | 'FLAT';
  stock: number;
  in_stock: boolean;
  expiry_date: Date;
  is_deleted: boolean;
}
