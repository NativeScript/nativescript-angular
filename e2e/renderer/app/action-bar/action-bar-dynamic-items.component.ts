import { Component } from "@angular/core";

@Component({
  template: `
    <ActionBar title="Action Bar Dynamic Items">
        <NavigationButton
            *ngIf="showNavigationButton"
            android.systemIcon="ic_menu_back"
        ></NavigationButton>

        <ActionItem text="one" *ngIf="show1"></ActionItem>
        <ActionItem text="two" *ngIf="show2"></ActionItem>
    </ActionBar>

    <StackLayout>
        <Button text="toggle nav" (tap)="showNavigationButton = !showNavigationButton"></Button>
        <Button text="toggle 1" (tap)="show1 = !show1"></Button>
        <Button text="toggle 2" (tap)="show2 = !show2"></Button>
    </StackLayout>
  `
})
export class ActionBarDynamicItemsComponent {
    public showNavigationButton = true;
    public show1 = true;
    public show2 = true;
}

