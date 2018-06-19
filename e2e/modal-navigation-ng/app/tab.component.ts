import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-tab",
    templateUrl: "tab.component.html",
})

export class TabComponent  {
    constructor(private routerExtension: RouterExtensions) { }
}
