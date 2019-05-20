import { Component } from "@angular/core";
import { SegmentedBar, SegmentedBarItem } from "tns-core-modules/ui/segmented-bar";

@Component({
    styles: ["#second { margin: 5; color: blue;" +
        "background-color: yellow;" +
        "font-weight: bold; font-size: 20;" +
        "font-style: italic; font-family: monospace;" +
        "height: 72; border-width: 2; border-radius: 7;" +
        "border-color:green; selected-background-color: red; }"],
    template: `
                <StackLayout>
                    <SegmentedBar selectedIndex="2" [items]="firstSegmentedBarItems"
                        style="color: yellow; background-color: blue; font-weight: bold;
                        font-size: 20; font-style: italic; font-family: monospace;
                        selected-background-color: red;">
                    </SegmentedBar>
                    <SegmentedBar id="second" [items]="secondSegmentedBarItems" selectedIndex="2"></SegmentedBar>
                </StackLayout>
            `
})
export class SegmentedBarIssue649Component {
    public firstSegmentedBarItems: Array<SegmentedBarItem> = [];
    public secondSegmentedBarItems: Array<SegmentedBarItem> = [];

    constructor() {
        for (let i = 1; i < 4; i++) {
            let segmentedBarItem = <SegmentedBarItem>new SegmentedBarItem();
            segmentedBarItem.title = "View " + i;
            this.firstSegmentedBarItems.push(segmentedBarItem);
            let segmentedBarItem1 = <SegmentedBarItem>new SegmentedBarItem();
            segmentedBarItem1.title = "View " + i * 2;
            this.secondSegmentedBarItems.push(segmentedBarItem1);
        }
    }
}
