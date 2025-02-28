"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handelCastError = (err) => {
    const errorSources = [
        {
            message: `Invalid ${err.path}: ${err.value}.`,
            path: err.path,
        },
    ];
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: 'Invalid Requested Data',
        errorSources,
    };
};
exports.default = handelCastError;
