import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { SegmentedBarItem, SegmentedBar } from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { ListView } from "tns-core-modules/ui/list-view/list-view";
import { EventData } from "tns-core-modules/ui/page/page";

interface DataItem {
    id: number;
    name: string;
    type: string;
}

@Component({
    moduleId: module.id,
    selector: "segmented-bar-list-test",
    template: `
        <GridLayout automationText="mainView" iosOverflowSafeArea="false" style="height: 100%;">
            <ListView
                #listViewTest
                [itemTemplateSelector]="templateSelector"
                [items]="displayedItems"
            >
                <ng-template let-item="item">
                    <label [text]="'Unsupported Element ' + item.type" color="red"></label>
                </ng-template>

                <ng-template nsTemplateKey="segmentedBarTemplate" let-item="item">
                    <SegmentedBar
                        [items]="segmentedBarItems"
                        (selectedIndexChange)="onSegmentedBarPress($event)"
                    ></SegmentedBar>
                </ng-template>

                <ng-template nsTemplateKey="dataItemTemplate" let-item="item">
                    <StackLayout>
                        <Label [text]="'index: ' + item.index" height="50"></Label>
                        <Label [text]="'[' + item.id + '] ' + item.name" height="50"></Label>
                    </StackLayout>
                </ng-template>

                <ng-template nsTemplateKey="buttonTemplate" let-item="item">
                    <button text="Pushing me shouldn't crash!" (tap)="onButtonPress()"></button>
                </ng-template>
            </ListView>
        </GridLayout>
    `,
})
export class ListViewSegmentedBarPageComponent implements OnInit {
    public displayedItems: Array<DataItem> = [];
    public items: Array<DataItem>;
    public segmentedBarItems: SegmentedBarItem[] = this.createSegmentedBarItems();

    @ViewChild("listViewTest", { static: false })
    private listViewTest?: ElementRef;

    constructor() {
        this.items = [];

        for (let i = 0; i < 20; i++) {
            const type = "dataItemTemplate";

            this.items.push({
                id: i,
                name: `data item ${i}`,
                type: type,
            });
        }
    }

    public ngOnInit() {
        this.displayedItems = this.updateItems(true);
    }

    public onButtonPress() {
        // tslint:disable-next-line: no-unused-expression
        new Promise((resolve) => {
            setTimeout(() => {
                if (this.listViewTest) {
                    console.log("Scrolling to the top of the list...");
                    const listView = this.listViewTest.nativeElement as ListView;
                    listView.scrollToIndex(0);
                }
                resolve();
            }, 150);
        });

        this.displayedItems = this.updateItems(false);
    }

    public onSegmentedBarPress(args: EventData) {
        if (args && args.object) {
            const segmentBar = args.object as SegmentedBar;
            const selectedOdd = segmentBar.selectedIndex === 0;
            this.displayedItems = this.updateItems(selectedOdd);
        }
    }

    public createSegmentedBarItems() {
        const itemOdd = new SegmentedBarItem();
        itemOdd.title = "Odd Items";
        const itemEven = new SegmentedBarItem();
        itemEven.title = "Even Items";
        return [itemOdd, itemEven];
    }

    public templateSelector(item: DataItem): string {
        return item.type;
    }

    private updateItems(odd: boolean) {
        const items = [
            {
                id: -1,
                name: "Segmented Bar",
                type: "segmentedBarTemplate",
            },
            ...(odd
                ? this.items.filter((item) => item.id % 2 === 1)
                : this.items.filter((item) => item.id % 2 === 0)),
            {
                id: 999,
                name: "Refresh test",
                type: "buttonTemplate",
            },
        ];
        return items;
    }
}
