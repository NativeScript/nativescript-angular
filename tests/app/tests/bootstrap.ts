//make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {bootstrap} from "nativescript-angular/application";
import {Component} from "@angular/core";

@Component({
    template: "<Button text='OHAI'></Button>"
})
export class SimpleApp {
}

describe('Bootstrap E2E', () => {
    it('SimpleApp bootstrapped', () => {
        return bootstrap(SimpleApp).then((componentRef) => {
            assert.isTrue(SimpleApp === componentRef.componentType);
        });
    });
});
