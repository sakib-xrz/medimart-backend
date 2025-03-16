"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateDiscountedPrice = (price, discount, discountType) => {
    let finalPrice = price;
    if (discount && discountType) {
        if (discountType === 'PERCENTAGE') {
            finalPrice = price - (price * discount) / 100;
        }
        else if (discountType === 'FLAT') {
            finalPrice = price - discount;
        }
    }
    return finalPrice < 0 ? 0 : finalPrice;
};
const CartUtils = { calculateDiscountedPrice };
exports.default = CartUtils;
