"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const handelZodError_1 = __importDefault(require("../errors/handelZodError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handelCastError_1 = __importDefault(require("../errors/handelCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, _req, res, next) => {
    let statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Something went wrong!';
    let errorSources = [
        {
            message: err.message || 'Something went wrong!',
            path: (err === null || err === void 0 ? void 0 : err.path) || '',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handelZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        const simplifiedError = (0, handelCastError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if (err instanceof Error) {
        errorSources = [
            {
                message: err.message,
                path: '',
            },
        ];
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                message: err.message,
                path: '',
            },
        ];
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'TokenExpiredError') {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Token has expired, please login again!';
        errorSources = [
            {
                message: err.message,
                path: '',
            },
        ];
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'JsonWebTokenError') {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Invalid token. Please provide a valid token.';
        errorSources = [
            {
                message: err.message,
                path: '',
            },
        ];
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: errorSources,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.default = globalErrorHandler;
