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
exports.DashboardRoutes = router;
