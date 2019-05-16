(<any>global).mocha.setup({
    timeout: 20000
});

import * as chai from "chai";
import * as sinon from "sinon";
export let assert: typeof chai.assert = (<any>global).chai.assert;
export let fake: typeof sinon.fake = (<any>global).sinon.fake;
export let spy: typeof sinon.spy = (<any>global).sinon.spy;
export let stub: typeof sinon.stub = (<any>global).sinon.stub;