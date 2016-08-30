global.mocha.setup({
    timeout: 20000,
});

import * as chai from "chai"
export var assert: typeof chai.assert = global.chai.assert;
