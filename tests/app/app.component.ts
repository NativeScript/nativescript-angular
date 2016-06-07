import {Component} from "@angular/core";
import {SinglePageMain} from "./single-page-main.component";
import {MultiPageMain} from "./multi-page-main.component";

@Component({
    selector: "my-app",
    directives: [SinglePageMain, MultiPageMain],
    template: `
    <multi-page-main></multi-page-main>
    <!--
    <single-page-main *ngIf="true"></single-page-main>
    -->
`,
})
export class AppComponent {
    public message: string = "Hello, Angular!";
}
