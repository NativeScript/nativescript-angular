import { assert } from "./test-config";
import { Component, Input, ViewChild } from "@angular/core";
import { ComponentFixture, async } from "@angular/core/testing";
import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender } from "nativescript-angular/testing";
import { ListViewComponent } from "nativescript-angular/directives";
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

@Component({
    selector: "list-view-default-item-template",
    template: `
    <GridLayout>
        <ListView #listView [items]="myItems"></ListView>
    </GridLayout>
    `
})
export class TestDefaultItemTemplateComponent {
    public myItems: Array<DataItem>;
    constructor () {
        this.myItems = new Array<DataItem>();
        for (let i = 0; i < 100; i++) {
            this.myItems.push(new DataItem(i, "Name " + i));
        }
    }
    @ViewChild("listView") listViewElement: ListViewComponent;
    onScrollListViewTo() { 
        this.listViewElement.nativeElement.scrollToIndex(100);
    }
}

describe("ListView-tests", () => {
    beforeEach(nsTestBedBeforeEach([
        TestListViewComponent,
        TestListViewSelectorComponent,
        ItemTemplateComponent,
        TestDefaultItemTemplateComponent
    ]));
    afterEach(nsTestBedAfterEach(false));

    it("setupItemView is called for every item", async(() => {
        nsTestBedRender(TestListViewComponent)
            .then((fixture: ComponentFixture<TestListViewComponent>) => {
                const component = fixture.componentRef.instance;
                assert.equal(component.counter, 3);
            });
    }));


    it("itemTemplateSelector selects templates", async(() => {
        nsTestBedRender(TestListViewSelectorComponent).then(() => {
            assert.deepEqual(testTemplates, { first: 2, second: 1 });
        });
    }));

    it("'defaultTemplate' does not throw when list-view is scrolled", async(() => {
        nsTestBedRender(TestDefaultItemTemplateComponent)
            .then((fixture: ComponentFixture<TestDefaultItemTemplateComponent>) => {
                const component = fixture.componentRef.instance;
                assert.doesNotThrow(component.onScrollListViewTo.bind(component));
            });
    }));
});
