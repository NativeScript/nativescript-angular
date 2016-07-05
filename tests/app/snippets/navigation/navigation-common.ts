// >> router-content-components-ts
import {Component} from '@angular/core';
import {NS_ROUTER_DIRECTIVES} from 'nativescript-angular/router';

@Component({
    selector: "first",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="First component" class="title"></Label>
        <Button text="GO TO SECOND" [nsRouterLink]="['/second']" class="link"></Button>
    </StackLayout>`
})
export class FirstComponent { }

@Component({
    selector: "second",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Label text="Second component" class="title"></Label>
        <Button text="GO TO FIRST" [nsRouterLink]="['/first']" class="link"></Button>
    </StackLayout>`
})
export class SecondComponent { }
// << router-content-components-ts


// >> router-location-back
import {Location} from '@angular/common';

@Component({ 
    // ...
    // >> (hide)
    template: '', selector:"go-back"
    // << (hide)
})
export class MyComponent {
    constructor(private location: Location) { }

    public goBack() {
        this.location.back();
    }
}
// << router-location-back
