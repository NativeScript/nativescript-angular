import {Component} from "@angular/core";
import {FirstComponent} from "../components/first.component";
import {SecondComponent} from "../components/second.component";

@Component({
    moduleId: module.id,
    selector: 'navigation-test',
    styleUrls: ['./router-outlet.css'],
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
export class NavigationTestRouter { }

export var NavigationSubRoutes = [
    { path: '', redirectTo: 'first', pathMatch: "full" },
    { path: 'first', component: FirstComponent },
    { path: 'second', component: SecondComponent },
];
