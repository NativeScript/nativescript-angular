import {Component} from '@angular/core';
import {NestedComponent} from "./action-bar-nested.component";

@Component({
    selector: "second-action-bar",
    directives: [NestedComponent],
    template: `
    <ActionBar title="Title 2" automationText="title">
        <NavigationButton text="First" android.systemIcon="ic_menu_back" automationText="back"></NavigationButton>
        <ActionItem [text]="message" automationText="msg"></ActionItem>      
        <ActionItem text="TAP" (tap)="onTap()" automationText="tap"></ActionItem>
    </ActionBar>

    <StackLayout verticalAlignment="center">
        <nested-component></nested-component>
    </StackLayout>
    `,
})
export class SecondComponentActionBar {

    public counter: number = 0;

    public get message(): string {
        if (this.counter == 1) {
            return this.counter + " tap";
        } else {
            return this.counter + " taps";
        }
    }

    public onTap() {
        this.counter++;
        console.log("SecondComponent.Tapped!");
    }
}
