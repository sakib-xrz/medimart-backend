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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_image_model_1 = require("../product-image/product-image.model");
const product_model_1 = require("./product.model");
const CreateMultipleProduct = (productsData) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.insertMany(productsData);
    return products;
});
const CreateProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new product_model_1.Product(productData);
    yield product.save();
    return product.toObject();
});
const GetAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = Object.assign(Object.assign({}, query), { is_deleted: false, fields: '-is_deleted,-createdAt,-updatedAt,-__v' });
    const queryBuilder = new QueryBuilder_1.default(product_model_1.Product.find(), query);
    const productsQuery = queryBuilder
        .search(['name', 'description', 'category'])
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, total] = yield Promise.all([
        productsQuery.modelQuery.lean().exec(),
        queryBuilder.getCountQuery(),
    ]);
    const productIds = data.map((product) => product._id);
    const images = yield product_image_model_1.ProductImage.find({
        product_id: { $in: productIds },
    }).lean();
    const productMap = new Map();
    data.forEach((product) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        productMap.set(product._id.toString(), Object.assign(Object.assign({}, product), { images: [] }));
    });
    images.forEach((image) => {
        const productId = image.product_id.toString();
        if (productMap.has(productId)) {
            productMap.get(productId).images.push(image);
        }
    });
    return {
        meta: Object.assign({ total }, queryBuilder.getPaginationInfo()),
        data: Array.from(productMap.values()),
    };
});
const ProductService = { CreateMultipleProduct, CreateProduct, GetAllProducts };
exports.default = ProductService;
