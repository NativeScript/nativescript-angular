import { Component } from "@angular/core";

@Component({
    selector: "main",
    template: `
    <StackLayout>
        <Button text="ListPicker" [nsRouterLink]="['/listPicker','list-picker']"></Button>        
     </StackLayout>   
    `, 
})
export class ListPickerMainPageComponent { }
