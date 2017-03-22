import { Component, ChangeDetectionStrategy } from "@angular/core";
import { DataItem, DataService } from "./data.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/operator/combineLatest";

@Component({
    selector: "list-test-async",
    styleUrls: ["examples/list/styles.css"],
    providers: [DataService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <GridLayout rows="auto * auto" columns="* *">
        <Label text="ListView" class="list-title"></Label>
        <Label text="*ngFor" class="list-title" col="1"></Label>

        <ListView row="1" [items]="service.items$ | async" (itemTap)="onItemTap($event)" margin="10">
            <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label [text]='"name: " + item.name'></Label>
                </StackLayout>
            </template>
        </ListView>

        <StackLayout row="1" col="1" margin="10">
            <StackLayout *ngFor="let item of (service.items$ | async); let odd = odd; let even = even" 
                [class.odd]="odd" [class.even]="even" marginBottom="1">
                <Label [text]='"name: " + item.name'></Label>
            </StackLayout>
        </StackLayout>

        <Button
            row="2" colSpan="2"
            (tap)="toggleAsyncUpdates()"
            [text]="isUpdating ? 'stop updates' : 'start updates'">
        </Button>
    </GridLayout>
    `
})
export class ListTestAsync {
    public isUpdating: boolean = false;
    constructor(private service: DataService) {
    }

    public onItemTap(args) {
        console.log("--> ItemTapped: " + args.index);
    }

    public toggleAsyncUpdates() {
        if (this.isUpdating) {
            this.service.stopAsyncUpdates();
        } else {
            this.service.startAsyncUpdates();
        }

        this.isUpdating = !this.isUpdating;
    }
}

@Component({
    selector: "list-test-async-filter",
    styleUrls: ["examples/list/styles.css"],
    providers: [DataService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <GridLayout rows="auto * auto" columns="* *">
        <Label text="ListView" class="list-title"></Label>
        <Label text="*ngFor" class="list-title" col="1"></Label>

        <ListView row="1" [items]="filteredItems$ | async" (itemTap)="onItemTap($event)" margin="10">
            <template let-item="item" let-i="index" let-odd="odd" let-even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label [text]='"name: " + item.name'></Label>
                </StackLayout>
            </template>
        </ListView>

        <StackLayout row="1" col="1" margin="10">
            <StackLayout *ngFor="let item of (filteredItems$  | async); let odd = odd; let even = even" 
                [class.odd]="odd" [class.even]="even" marginBottom="1">
                <Label [text]='"name: " + item.name'></Label>
            </StackLayout>
        </StackLayout>

        <StackLayout row="2" colSpan="2" orientation="horizontal">
            <button (tap)="toggleAsyncUpdates()" [text]="isUpdating ? 'stop updates' : 'start updates'"></button>
            <button (tap)="toggleFilter()" [text]="(filter$ | async) ? 'show all' : 'show even'"></button>
        </StackLayout>
    </GridLayout>
    `
})
export class ListTestFilterAsync {
    public isUpdating: boolean = false;
    public filteredItems$: Observable<Array<DataItem>>;
    private filter$ = new BehaviorSubject(false);

    constructor(private service: DataService) {
        this.filteredItems$ = this.service.items$.combineLatest(this.filter$, (data, filter) => {
            return filter ? data.filter(v => v.id % 2 === 0) : data;
        });
    }

    public onItemTap(args) {
        console.log("--> ItemTapped: " + args.index);
    }

    public toggleAsyncUpdates() {
        if (this.isUpdating) {
            this.service.stopAsyncUpdates();
        } else {
            this.service.startAsyncUpdates();
        }

        this.isUpdating = !this.isUpdating;
    }

    public toggleFilter() {
        this.filter$.next(!this.filter$.value);
    }
}
