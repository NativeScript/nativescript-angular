import { Component } from "@angular/core";
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NS_ROUTER_DIRECTIVES} from "nativescript-angular/router"

@Component({
    selector: "second",
    directives: [ROUTER_DIRECTIVES, NS_ROUTER_DIRECTIVES],
    styleUrls: ["examples/livesync-test/second/second.component.css"],
    templateUrl: "examples/livesync-test/second/second.component.xml"
})
export class SecondComponent {
}