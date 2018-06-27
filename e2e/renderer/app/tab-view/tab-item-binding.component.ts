import { Component } from "@angular/core";
import { isAndroid } from "platform";

function getIconSource(icon: string): string {
    const iconPrefix = isAndroid ? "res://" : "res://tabIcons/";

    return iconPrefix + icon;
}

const notSelected = {
    title:  "Not Selected",
    textTransform: "lowercase",
    iconSource: getIconSource("home")
};

const selected = {
    title: "Selected",
    textTransform: "uppercase",
    iconSource: getIconSource("browse")
};

@Component({
  template: `
    <ActionBar title="Tab Item Binding"></ActionBar>

    <TabView (selectedIndexChange)="onIndexChange($event)">
        <GridLayout *tabItem="items[0]">
            <Label text="First Tab"></Label>
        </GridLayout>
        <GridLayout *tabItem="items[1]">
            <Label text="Second Tab"></Label>
        </GridLayout>
        <GridLayout *tabItem="items[2]">
            <Label text="Third Tab"></Label>
        </GridLayout>
    </TabView>
  `
})
export class TabItemBindingComponent {
    public items = [
        notSelected,
        notSelected,
        notSelected
    ];

    onIndexChange(args): void {
        const selectedIndex = args.object.selectedIndex;

        for (let i = 0; i < this.items.length; i++) { 
            this.items[i] = notSelected;
        }

        this.items[selectedIndex] = selected;
    }
}

