"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_ts_1 = require("./src/config/migraction/index.ts");
exports.default = {
    development: index_ts_1.configr.development,
    test: index_ts_1.configr.test,
    production: index_ts_1.configr.production,
};
