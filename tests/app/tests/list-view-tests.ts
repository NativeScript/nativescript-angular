import { assert } from "./test-config";
import { Component, Input, AfterViewInit } from "@angular/core";
import { TestApp } from "./test-app";
import { RootLocator, ComponentView, getItemViewRoot } from "nativescript-angular/directives/list-view-comp";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container";

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
    let testApp: TestApp = null;

    before(() => {
        return TestApp.create([], [
            TestListViewComponent,
            TestListViewSelectorComponent,
            ItemTemplateComponent
        ]).then((app) => {
            testApp = app;
        });
    });

    after(() => {
        testApp.dispose();
    });

    afterEach(() => {
        testApp.disposeComponents();
    });

    it("setupItemView is called for every item", (done) => {
        return testApp.loadComponent(TestListViewComponent).then((componentRef) => {
            const component = componentRef.instance;
            setTimeout(() => {
                assert.equal(component.counter, 3);
                done();
            }, 1000);
        })
            .catch(done);
    });


    it("itemTemplateSelector selects templates", (done) => {
        return testApp.loadComponent(TestListViewSelectorComponent).then((componentRef) => {
            setTimeout(() => {
                assert.deepEqual(testTemplates,  { first: 2, second: 1 });
                done();
            }, 1000);
        })
            .catch(done);
    });
});
