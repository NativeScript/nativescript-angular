import { Component } from "@angular/core";

@Component({
    template: `<Button text="Lazy module" [nsRouterLink]="['/lazy']"></Button>`,
})
export class LazyNavigationComponent {
}
