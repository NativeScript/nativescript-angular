import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    // ...
    // >> (hide)
    moduleId: module.id,
    selector: "router-extensions-import",
    templateUrl: "router-extensions.html"
    // << (hide)
})
export class MyComponent {
    constructor(private routerExtensions: RouterExtensions) { }

    // >> router-clear-history-code
    login() {
        // app logic here ...
        this.routerExtensions.navigate(["/main"], { clearHistory: true });
    }
    // << router-clear-history-code

    // >> router-back
    public goBack() {
        this.routerExtensions.back();
    }
    // << router-back

    // >> router-page-back
    public goBackPage() {
        this.routerExtensions.backToPreviousPage();
    }
    // << router-page-back

    // >> router-page-transition-code
    flipToNextPage() {
        this.routerExtensions.navigate(["/main"], {
            transition: {
                name: "flip",
                duration: 2000,
                curve: "linear"
            }
        });
    }
    // << router-page-transition-code
}

// >> router-extensions-import
@Component({
    // ...
    // >> (hide)
    selector: "component",
    template: `<StackLayout><Label text="Main Page"></Label></StackLayout>`
    // << (hide)
})
export class MainComponent {
    constructor(private routerExtensions: RouterExtensions) {
        // ...
    }
}
// << router-extensions-import

@Component({
    selector: "application",
    template: "<page-router-outlet></page-router-outlet>"
})
export class App { }

const routes = [
    { path: "", component: MyComponent },
    { path: "main", component: MainComponent },
];
