import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class CounterService {
    counter$ = new BehaviorSubject<number>(0);

    tick() {
        this.counter$.next(this.counter$.value + 1);
    }
}