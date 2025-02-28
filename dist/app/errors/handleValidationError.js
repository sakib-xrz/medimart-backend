"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handelValidationError = (err) => {
    const errorValues = Object.values(err.errors);
    const errorSources = errorValues.map((error) => {
        return {
            message: error.message,
            path: error.path,
        };
    });
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: 'Validation Error!',
        errorSources,
    };
};
exports.default = handelValidationError;
