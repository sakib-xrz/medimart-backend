"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_image_model_1 = require("./product-image.model");
const handelFile_1 = require("../../utils/handelFile");
const product_model_1 = require("../product/product.model");
const mongoose_1 = __importDefault(require("mongoose"));
const UploadProductImage = (payload, file) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (payload.type === 'PRIMARY') {
            const primaryImage = yield product_image_model_1.ProductImage.findOne({ product_id: payload.product_id, type: 'PRIMARY' }, null, { session });
            if (primaryImage) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Primary image already exists for this product');
            }
        }
        const cloudinaryResponse = yield (0, handelFile_1.uploadToCloudinary)(file, {
            folder: `/medimart/products`,
        });
        const image_url = cloudinaryResponse.secure_url;
        const public_id = cloudinaryResponse.public_id;
        const productImageData = {
            product_id: payload.product_id,
            image_url,
            public_id,
            type: payload.type,
        };
        const result = yield product_image_model_1.ProductImage.create([productImageData], { session });
        yield product_model_1.Product.updateOne({ _id: payload.product_id }, { $push: { images: result[0]._id } }, { session });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const ProductImageService = { UploadProductImage };
exports.default = ProductImageService;
