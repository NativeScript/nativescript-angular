import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class DataItem {
    constructor(public id: number, public name: string) { }
}

@Injectable()
export class DataService {
    private _intervalId;
    private _counter = 0;
    private _currentItems: Array<DataItem>;
    
    public items$: BehaviorSubject<Array<DataItem>>;

    constructor() {
        this._currentItems = [];
        for (var i = 0; i < 3; i++) {
            this.appendItem()
        }

        this.items$ = new BehaviorSubject(this._currentItems);
    }

    public startAsyncUpdates() {
        if (this._intervalId) {
            throw new Error("Updates are already started");
        }

        this._intervalId = setInterval(() => {
            this.appendItem();
            this.publishUpdates();
        }, 200);

    }

    public stopAsyncUpdates() {
        if (!this._intervalId) {
            throw new Error("Updates are not started");
        }

        clearInterval(this._intervalId);
        this._intervalId = undefined;
    }

    private publishUpdates() {
        this.items$.next([...this._currentItems]);
    }

    private appendItem() {
        this._currentItems.push(new DataItem(this._counter, "data item " + this._counter));
        this._counter++;
    }
}