import { Component } from "@angular/core";

@Component({
    selector: "main-list-picker",
    template: `
    <StackLayout>
        <Button text="ListPicker" [nsRouterLink]="['/listPicker','list-picker']"></Button>
     </StackLayout>
    `,
})
export class ListPickerMainPageComponent { }
