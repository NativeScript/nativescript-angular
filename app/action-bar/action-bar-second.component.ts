import {Component} from '@angular/core';

@Component({
    selector: "second-action-bar",
    template: `
    <ActionBar title="Title 2">
        <NavigationButton text="First" android.systemIcon="ic_menu_back"></NavigationButton>
        <ActionItem [text]="message"></ActionItem>      
        <ActionItem text="TAP" (tap)="onTap()"></ActionItem>
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
