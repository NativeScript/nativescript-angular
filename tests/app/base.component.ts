import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
import {Component} from "@angular/core";


export const hooksLog = [];

export class BaseComponent implements OnActivate, OnDeactivate {
    protected name: string = "";

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("activate", nextInstruction, prevInstruction);
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("deactivate", nextInstruction, prevInstruction);
    }

    private log(method: string, nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction) {
        hooksLog.push(this.name + "." + method + " " + nextInstruction.urlPath + " " + (prevInstruction ? prevInstruction.urlPath : null));
    }
}
