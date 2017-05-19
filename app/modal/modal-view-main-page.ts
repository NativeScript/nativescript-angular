import { Component } from "@angular/core";

@Component({
    selector: "main",
    template: `
    <StackLayout>
        <Button text="modal" [nsRouterLink]="['/modal','modal-dialogs']"></Button>        
        <Button text="modal(onPush)" [nsRouterLink]="['/modal','modal-dialogs-push']"></Button>
     </StackLayout>   
    `,
})
export class ModalViewMainPageComponent { }
