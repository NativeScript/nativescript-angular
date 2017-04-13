(<any>global).mocha.setup({
    timeout: 20000,
});

import * as chai from "chai";
export let assert: typeof chai.assert = (<any>global).chai.assert;
