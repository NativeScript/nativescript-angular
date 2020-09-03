import { Component } from "@angular/core";

@Component({
    selector: "main-modal",
    template: `
    <StackLayout>
        <Button text="modal" [nsRouterLink]="['/modal','modal-dialogs']"></Button>
        <Button text="modal(onPush)" [nsRouterLink]="['/modal','modal-dialogs-push']"></Button>
        <Button text="modal(lazy)" [nsRouterLink]="['/modal','lazy']"></Button>
     </StackLayout>
    `,
})
export class ModalViewMainPageComponent { }
