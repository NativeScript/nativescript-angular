import { Component} from "@angular/core";

@Component({
    moduleId: module.id,
    selector: "renderer-test",
    template: `
    <StackLayout>
        <Button text="Toggle first" (tap)="first = !first"></Button>
        <Button text="Toggle second" (tap)="second = !second"></Button>

        <Label text="== 1 =="></Label>

        <Label *ngIf="first" text="first"></Label>
        <Label *ngIf="second" text="second"></Label>

        <Label text="== 2 =="></Label>

    </StackLayout>`
})
export class NgIfSubsequent {
    public first: boolean = false;
    public second: boolean = false;
}
