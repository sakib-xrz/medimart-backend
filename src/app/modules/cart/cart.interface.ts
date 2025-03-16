type CartProduct = {
  id: string;
  quantity: number;
};

export interface CartInterface {
  cart_items: CartProduct[];
}
