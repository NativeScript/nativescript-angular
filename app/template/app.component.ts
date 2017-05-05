import {Component} from "@angular/core";

@Component({
    moduleId: module.id,
    selector: "my-app",
    styles: ["button {color: lime}"],
    styleUrls: ["./app.component.css"],  
    template: `
<StackLayout>
    <Label text="Tap the button" class="title"></Label>
    
    <Button text="TAP" (tap)="onTap()"></Button>

    <Label [text]="message" class="message" textWrap="true"></Label>
</StackLayout>
`,
})
export class AppComponent {
    public counter: number = 16;

    public get message(): string {
        if (this.counter > 0) {
            return this.counter + " taps left";
        } else {
            return "Hoorraaay! \nYou are ready to start building!";
        }
    }
    
    public onTap() {
        this.counter--;
    }
}
