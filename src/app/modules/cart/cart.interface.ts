type CartProduct = {
  id: string;
  quantity: number;
};

export interface CartInterface {
  products: CartProduct[];
}
