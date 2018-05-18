import { assert } from "./test-config";
import { Component, Input } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender } from "nativescript-angular/testing";
// import trace = require("trace");
// trace.setCategories("ns-list-view, " + trace.categories.Navigation);
// trace.enable();

class DataItem {
    constructor(public id: number, public name: string) { }
}

const ITEMS = [
    new DataItem(0, "data item 0"),
    new DataItem(1, "data item 1"),
    new DataItem(2, "data item 2"),
];


let testTemplates: { first: number, second: number };

@Component({
    selector: "list-view-setupItemView",
    template: `
    <GridLayout>
        <ListView [items]="myItems" (setupItemView)="onSetupItemView($event)">
            <ng-template let-item="item">
                <Label [text]='"[" + item.id +"] " + item.name'></Label>
            </ng-template>
        </ListView>
    </GridLayout>
    `
})
export class TestListViewComponent {
    public myItems: Array<DataItem> = ITEMS;
    public counter: number = 0;
    onSetupItemView(args) { this.counter++; }
}

@Component({
    selector: "item-component",
    template: `<Label text="template"></Label>`
})
export class ItemTemplateComponent {
    @Input() set templateName(value: any) {
        if (value === "first") {
            testTemplates.first = testTemplates.first + 1;
        } else if (value === "second") {
            testTemplates.second = testTemplates.second + 1;
        } else {
            throw new Error("Unexpected templateName: " + value);
        }
    }
}

@Component({
    selector: "list-with-template-selector",
    template: `
    <GridLayout>
        <ListView [items]="myItems" [itemTemplateSelector]="templateSelector">
            <ng-template nsTemplateKey="first">
                <item-component templateName="first"></item-component>
            </ng-template>
            <ng-template nsTemplateKey="second" let-item="item">
                <item-component templateName="second"></item-component>
            </ng-template>
        </ListView>
    </GridLayout>
    `
})
export class TestListViewSelectorComponent {
    public myItems: Array<DataItem> = ITEMS;
    public templateSelector = (item: DataItem, index: number, items: any) => {
        return (item.id % 2 === 0) ? "first" : "second";
    }
    constructor() { testTemplates = { first: 0, second: 0 }; }
}

describe("ListView-tests", () => {
    beforeEach(nsTestBedBeforeEach([
        TestListViewComponent,
        TestListViewSelectorComponent,
        ItemTemplateComponent
    ]));
    afterEach(nsTestBedAfterEach(false));

    it("setupItemView is called for every item", (done) => {
        nsTestBedRender(TestListViewComponent)
            .then((fixture: ComponentFixture<TestListViewComponent>) => {
                const component = fixture.componentRef.instance;
                assert.equal(component.counter, 3);
                done();
            });
    });


    it("itemTemplateSelector selects templates", (done) => {
        nsTestBedRender(TestListViewSelectorComponent).then(() => {
            assert.deepEqual(testTemplates, {first: 2, second: 1});
            done();
        });
    });
});
