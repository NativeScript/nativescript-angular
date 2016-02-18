//stash it here before Angular runs it over...
const realAssert = global.assert;
import "reflect-metadata";
import {bootstrap} from "../nativescript-angular/application";
import {Component} from "angular2/core";
global.assert = realAssert;
import * as chai from "chai"
declare var assert: typeof chai.assert;

@Component({
    template: "<Button text='OHAI'></Button>"
})
export class SimpleApp {
}

describe('bootstrap', () => {
    it('SimpleApp bootstrapped', (done) => {
        return bootstrap(SimpleApp).then((componentRef) => {
            assert.isTrue(SimpleApp === componentRef.componentType);
            done();
        });
    });
});
