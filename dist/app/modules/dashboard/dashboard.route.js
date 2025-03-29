"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/stats-summary', (0, auth_1.default)('ADMIN'), dashboard_controller_1.DashboardController.getStatsSummary);
router.get('/revenue-summary', (0, auth_1.default)('ADMIN'), dashboard_controller_1.DashboardController.getRevenueSummary);
router.get('/recent-orders', (0, auth_1.default)('ADMIN'), dashboard_controller_1.DashboardController.getRecentOrders);
router.get('/low-stock-products', (0, auth_1.default)('ADMIN'), dashboard_controller_1.DashboardController.getLowStockProducts);
router.get('/expiring-products', (0, auth_1.default)('ADMIN'), dashboard_controller_1.DashboardController.getExpiringProducts);
exports.DashboardRoutes = router;
