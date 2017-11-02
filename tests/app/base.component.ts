import { InjectionToken, OnInit, OnDestroy } from "@angular/core";
export const HOOKS_LOG = new InjectionToken("Hooks log");
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class BaseComponent implements OnInit, OnDestroy {
    protected name: string = "";

    constructor(protected hooksLog: BehaviorSubject<Array<string>>) {
    }

    ngOnInit() {
        this.log("init");
    }

    ngOnDestroy() {
        this.log("destroy");
    }

    private log(method: string) {
        this.hooksLog.next([...this.hooksLog.value, this.name + "." + method]);
    }
}
