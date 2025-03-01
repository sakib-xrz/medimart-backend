"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const product_image_controller_1 = __importDefault(require("./product-image.controller"));
const handelFile_1 = require("../../utils/handelFile");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)('ADMIN'), handelFile_1.upload.single('file'), product_image_controller_1.default.UploadProductImage);
exports.ProductImageRoutes = router;
