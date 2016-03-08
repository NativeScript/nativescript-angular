//make sure you import mocha-config before angular2/core
import {assert} from "./test-config";
import {bootstrap} from "../nativescript-angular/application";
import {Component} from "angular2/core";

@Component({
    template: "<Button text='OHAI'></Button>"
})
export class SimpleApp {
}

describe('bootstrap', () => {
    it('SimpleApp bootstrapped', () => {
        return bootstrap(SimpleApp).then((componentRef) => {
            assert.isTrue(SimpleApp === componentRef.componentType);
        });
    });
});
