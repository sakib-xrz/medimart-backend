"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = __importDefault(require("./user.controller"));
const router = express_1.default.Router();
router
    .route('/profile')
    .get((0, auth_1.default)('ADMIN', 'CUSTOMER'), user_controller_1.default.GetMyProfile);
router.get('/', (0, auth_1.default)('ADMIN'), user_controller_1.default.GetAllCustomers);
router.patch('/:id/status', (0, auth_1.default)('ADMIN'), user_controller_1.default.UpdateUserStatus);
router.delete('/:id', (0, auth_1.default)('ADMIN'), user_controller_1.default.DeleteUser);
exports.UserRoutes = router;
