"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
it("add 1 + 2 to equal 3", () => {
    expect((0, utils_1.add)(1, 2)).toBe(3);
});
