"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = __importDefault(require("./product.validation"));
const product_controller_1 = __importDefault(require("./product.controller"));
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)('ADMIN'), (0, validateRequest_1.default)(product_validation_1.default.CreateProductSchema), product_controller_1.default.CreateProduct);
router
    .route('/bulk')
    .post((0, auth_1.default)('ADMIN'), (0, validateRequest_1.default)(product_validation_1.default.CreateMultipleProductSchema), product_controller_1.default.CreateMultipleProduct);
exports.ProductRoutes = router;
