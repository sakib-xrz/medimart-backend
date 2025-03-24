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
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("./product.model");
const product_utils_1 = __importDefault(require("./product.utils"));
const slugify_1 = __importDefault(require("slugify"));
const CreateMultipleProduct = (productsData) => __awaiter(void 0, void 0, void 0, function* () {
    const modifiedProductsData = productsData.map((product) => {
        return Object.assign(Object.assign({}, product), { slug: product_utils_1.default.GenerateRandomProductSlug(), in_stock: product.stock > 0, category_slug: (0, slugify_1.default)(product.category, {
                lower: true,
                trim: true,
                remove: /[*+~.()'"!:@]/g,
            }) });
    });
    const products = yield product_model_1.Product.insertMany(modifiedProductsData);
    return products;
});
const CreateProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    productData.slug = product_utils_1.default.GenerateRandomProductSlug();
    productData.in_stock = productData.stock > 0;
    productData.category_slug = (0, slugify_1.default)(productData.category, {
        lower: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g,
    });
    const product = new product_model_1.Product(productData);
    yield product.save();
    return product.toObject();
});
const GetFeatureProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find({ is_deleted: false, in_stock: true })
        .select('-pack_size -manufacturer -createdAt -updatedAt -is_deleted -__v')
        .limit(4)
        .sort({ createdAt: -1 })
        .lean();
    return products;
});
const GetProductByCategory = (category_slug, query) => __awaiter(void 0, void 0, void 0, function* () {
    query = Object.assign(Object.assign({}, query), { fields: '-pack_size -manufacturer -createdAt -updatedAt -is_deleted -__v', is_deleted: false, category_slug });
    const queryBuilder = new QueryBuilder_1.default(product_model_1.Product.find(), query);
    const productsQuery = queryBuilder
        .search(['name', 'category'])
        .filter()
        .sort()
        .fields()
        .paginate();
    const total = yield queryBuilder.getCountQuery();
    const products = yield productsQuery.modelQuery;
    return {
        meta: Object.assign({ total }, queryBuilder.getPaginationInfo()),
        data: products,
    };
});
const GetAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    query = Object.assign(Object.assign({}, query), { fields: '-pack_size -manufacturer -createdAt -updatedAt -is_deleted -__v', is_deleted: false });
    const queryBuilder = new QueryBuilder_1.default(product_model_1.Product.find(), query);
    const productsQuery = queryBuilder
        .search(['name', 'category', 'slug'])
        .filter()
        .sort()
        .fields()
        .paginate();
    const total = yield queryBuilder.getCountQuery();
    const products = yield productsQuery.modelQuery;
    return {
        meta: Object.assign({ total }, queryBuilder.getPaginationInfo()),
        data: products,
    };
});
const GetProductBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findOne({ slug, is_deleted: false })
        .select('-createdAt -updatedAt -is_deleted -__v')
        .lean();
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    return product;
});
const UpdateProduct = (productId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield product_model_1.Product.findById(productId);
    if (!isProductExists || isProductExists.is_deleted) {
        throw new AppError_1.default(404, 'Product not found');
    }
    if (updates === null || updates === void 0 ? void 0 : updates.category) {
        updates.category_slug = (0, slugify_1.default)(updates.category, {
            lower: true,
            trim: true,
            remove: /[*+~.()'"!:@]/g,
        });
    }
    const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(productId, updates, {
        new: true,
        runValidators: true,
    });
    return updatedProduct;
});
const DeleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.findByIdAndUpdate(productId, {
        is_deleted: true,
    });
    if (!result) {
        throw new AppError_1.default(404, 'Product not found');
    }
    return result;
});
const ProductService = {
    CreateMultipleProduct,
    CreateProduct,
    GetFeatureProducts,
    GetProductByCategory,
    GetAllProducts,
    GetProductBySlug,
    UpdateProduct,
    DeleteProduct,
};
exports.default = ProductService;
