global.mocha.setup({
    timeout: 20000,
});

const realAssert = global.assert;
import "reflect-metadata";
export * from "angular2/core";
global.assert = realAssert;

import * as chai from "chai"
export var assert: typeof chai.assert = global.assert;
