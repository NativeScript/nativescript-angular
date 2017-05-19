import { Component } from "@angular/core";
import { FirstComponent } from "./first.component";
import { SecondComponent } from "./second.component";

@Component({
    moduleId: module.id,
    selector: "navigation-test",
    styleUrls: ["./navigation.component.css"],
    template: `
        <StackLayout>
            <StackLayout class="nav">
                <Button text="First" 
                    [nsRouterLink]="['/router','first']"></Button>
                <Button text="Second"
                    [nsRouterLink]="['/router','second']"></Button>
            </StackLayout>

            <router-outlet></router-outlet>
        </StackLayout>
    `
})
export class NavigationComponent { }

export var NavigationSubRoutes = [
    { path: "", redirectTo: "first", pathMatch: "full" },
    { path: "first", component: FirstComponent },
    { path: "second", component: SecondComponent },
];
