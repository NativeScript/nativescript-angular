import { Component } from "@angular/core";

@Component({
    selector: "main",
    template: `
    <StackLayout>
        <Button text="ListView" [nsRouterLink]="['/listView','commonTemplate']"></Button>        
        <Button text="ListViewCustomTemplate" [nsRouterLink]="['/listView','customTemplate']"></Button>
        <Button text="ListViewAsyncPipe" [nsRouterLink]="['/listView','asyncPipeTemplate']"></Button>  
     </StackLayout>   
    `,
})
export class ListViewMainPageComponent { }
