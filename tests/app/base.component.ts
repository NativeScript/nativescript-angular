import {ROUTER_DIRECTIVES, Router, OnActivate, OnDeactivate, CanReuse, OnReuse,
    RouteParams, ComponentInstruction, RouteConfig } from '@angular/router-deprecated';
import {Component, OpaqueToken} from "@angular/core";
export const HOOKS_LOG = new OpaqueToken("Hooks log");

export class BaseComponent implements OnActivate, OnDeactivate {
    protected name: string = "";

    constructor(protected hooksLog: string[]) {
    }

    routerOnActivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("activate", nextInstruction, prevInstruction);
    }

    routerOnDeactivate(nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction): any {
        this.log("deactivate", nextInstruction, prevInstruction);
    }

    private log(method: string, nextInstruction: ComponentInstruction, prevInstruction: ComponentInstruction) {
        this.hooksLog.push(this.name + "." + method + " " + nextInstruction.urlPath + " " + (prevInstruction ? prevInstruction.urlPath : null));
    }
}
