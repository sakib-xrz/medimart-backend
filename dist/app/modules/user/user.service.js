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
const user_model_1 = require("./user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const GetMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({
        email: user.email,
        is_blocked: false,
    }).select('-is_blocked -createdAt -updatedAt');
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return result;
});
const GetAllCustomers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.default(user_model_1.User.find({ role: 'CUSTOMER' }), query);
    const users = yield queryBuilder
        .search(['name', 'email'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery.select('-password -updatedAt');
    const total = yield queryBuilder.getCountQuery();
    return {
        meta: Object.assign({ total }, queryBuilder.getPaginationInfo()),
        data: users,
    };
});
const BlockUser = (targetedUserId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const targetedUser = yield user_model_1.User.findById(targetedUserId);
    if (!targetedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (targetedUser._id.toString() === user._id.toString()) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You can not block yourself');
    }
    yield user_model_1.User.findByIdAndUpdate(targetedUserId, {
        status: targetedUser.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED',
    });
});
const UserService = { GetMyProfile, GetAllCustomers, BlockUser };
exports.default = UserService;
