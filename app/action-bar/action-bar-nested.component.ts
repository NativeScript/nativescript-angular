import {Component} from '@angular/core';
import {NS_ROUTER_DIRECTIVES} from "nativescript-angular/router/ns-router";

@Component({
    selector: "nested-component",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <ActionBarExtension>
        <ActionItem *ngIf="show" (tap)="onTap()">
            <Button text="CUSTOM"></Button>
        </ActionItem>
    </ActionBarExtension>

    <StackLayout orientation="horizontal" horizontalAlignment="center">
        <Button [text]="show ? 'hide' : 'show'" (tap)="show = !show"></Button>
        <Label [text]="message"></Label>
    </StackLayout>
    `,
})
export class NestedComponent {

    public counter: number = 0;
    public show: boolean = true;

    public get message(): string {
        if (this.counter == 1) {
            return this.counter + " custom tap";
        } else {
            return this.counter + " custom taps";
        }
    }

    public onTap() {
        this.counter++;
        console.log("NestedComponent.Tapped!");
    }
}
