import { Component } from "@angular/core";

@Component({
    selector: "errorhandler-text",
    template: `
        <StackLayout verticalAlignment="center" horizontalAlignment="center">
            <Button text="error" (tap)="error()"></Button>
        </StackLayout>
    `
})
export class ErrorHandlerAppComponent {
    error() {
      throw new Error(`Triggered at ${new Date()}`);
    }
}
