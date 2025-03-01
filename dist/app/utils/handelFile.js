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
exports.deleteFromCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const index_1 = __importDefault(require("../config/index"));
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: index_1.default.cloudinary.cloud_name,
    api_key: index_1.default.cloudinary.api_key,
    api_secret: index_1.default.cloudinary.api_secret,
});
// Cloudinary storage configuration
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    // eslint-disable-next-line no-undef
    params: (_req, file) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            folder: 'uploads', // Change folder name if needed
            format: file.mimetype.split('/')[1],
            public_id: `${Date.now()}-${file.originalname}`,
            resource_type: 'auto',
        });
    }),
});
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 30 * 1024 * 1024 } }); // 30MB limit
exports.upload = upload;
// Function for deleting files from Cloudinary
const deleteFromCloudinary = (publicIds) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
        cloudinary_1.v2.api.delete_resources(ids, (error, result) => {
            if (error) {
                return reject(new Error(`Failed to delete from Cloudinary: ${error.message}`));
            }
            resolve(result);
        });
    });
});
exports.deleteFromCloudinary = deleteFromCloudinary;
