(<any>global).mocha.setup({
    timeout: 70000
});

import * as chai from "chai";
export let assert: typeof chai.assert = (<any>global).chai.assert;
