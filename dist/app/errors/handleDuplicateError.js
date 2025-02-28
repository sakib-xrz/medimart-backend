"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message = `Duplicate value: ${value[0]} for "${Object.keys(err.keyValue)[0]}" field`;
    const errorSources = [
        {
            message,
            path: Object.keys(err.keyValue)[0],
        },
    ];
    return {
        statusCode: http_status_1.default.CONFLICT,
        message: 'Duplicate Field Value',
        errorSources,
    };
};
exports.default = handleDuplicateError;
