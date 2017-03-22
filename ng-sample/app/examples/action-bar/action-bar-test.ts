import { Component } from "@angular/core";
import { Page } from "ui/page";

@Component({
    selector: "first",
    template: `
    <ActionBar title="Custom Title">
        <ActionItem *ngIf="show" text="action" (tap)="onTap()"></ActionItem>
        <ActionItem ios.systemIcon="9" android.systemIcon="ic_menu_share_holo_light" (tap)="onShare()"></ActionItem>
    </ActionBar>

    <StackLayout verticalAlignment="center">
        <Button [text]="show ? 'hide' : 'show'" (tap)="show = !show"></Button>
        <Button text="Start" [nsRouterLink]="['/second']"></Button>
    </StackLayout>
    `,
})
class FirstComponent {
    public show: boolean = true;
    onTap() {
        console.log("FirstComponent.Tapped!");
    }
    onShare() {
        console.log("Share button tapped!");
    }
}


@Component({
    selector: "nested-component",
    template: `
    <ActionBarExtension>
        <ActionItem *ngIf="show" (tap)="onTap()">
            <Button text="CUSTOM"></Button>
        </ActionItem>
    </ActionBarExtension>

    <StackLayout verticalAlignment="center">
        <Button [text]="show ? 'hide' : 'show'" (tap)="show = !show"></Button>
    </StackLayout>
    `,
})
class NestedComponent {
    public show: boolean = true;

    onTap() {
        console.log("NestedComponent.Tapped!");
    }
}

@Component({
    selector: "second",
    template: `
    <ActionBar title="Second Page Title">
        <NavigationButton text="First" android.systemIcon="ic_menu_back"></NavigationButton>
        <ActionItem text="TapMe" (tap)="onTap()"></ActionItem>
    </ActionBar>

    <StackLayout verticalAlignment="center">
        <Label text="Second Page is Here" class="title"></Label>
        <nested-component></nested-component>
    </StackLayout>
    `,
})
class SecondComponent {
    onTap() {
        console.log("SecondComponent.Tapped!");
    }
}

@Component({
    selector: "action-bar-test",
    template: `
    <GridLayout>
       <page-router-outlet></page-router-outlet>
    </GridLayout>
    `
})
export class ActionBarTest {
    static routes = [
        { path: "", component: FirstComponent },
        { path: "second", component: SecondComponent },
    ];

    static entries = [
        FirstComponent,
        SecondComponent,
    ];
}
