import { Component } from "@angular/core";
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NS_ROUTER_DIRECTIVES} from "nativescript-angular/router"

@Component({
    selector: "first",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/livesync-test/first/first.component.css"],
    templateUrl: "examples/livesync-test/first/first.component.xml"
})
export class FirstComponent {
}