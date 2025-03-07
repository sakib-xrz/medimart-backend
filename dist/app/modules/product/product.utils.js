"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
function GenerateRandomProductSlug() {
    const uuid = (0, uuid_1.v4)();
    const alphanumeric = uuid.replace(/[^a-z0-9]/gi, '');
    return `med-${alphanumeric.substring(0, 6)}`;
}
const ProductUtils = { GenerateRandomProductSlug };
exports.default = ProductUtils;
