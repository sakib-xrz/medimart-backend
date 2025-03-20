"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const order_controller_1 = __importDefault(require("./order.controller"));
const handelFile_1 = require("../../utils/handelFile");
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)('CUSTOMER'), handelFile_1.upload.single('prescription'), order_controller_1.default.CreateProduct);
router.route('/my-orders').get((0, auth_1.default)('CUSTOMER'), order_controller_1.default.GetMyOrders);
router
    .route('/my-orders/:id')
    .get((0, auth_1.default)('CUSTOMER'), order_controller_1.default.GetMyOrderById);
exports.OrderRoutes = router;
