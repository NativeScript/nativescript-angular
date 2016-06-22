import { Component } from "@angular/core";
import { NS_ROUTER_DIRECTIVES } from "nativescript-angular/router";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Button text="ListView" [nsRouterLink]="['./commonTemplate']"></Button>        
        <Button text="ListViewCustomTemplate" [nsRouterLink]="['./customTemplate']"></Button>
        <Button text="ListViewAsyncPipe" [nsRouterLink]="['./asyncPipeTemplate']"></Button>  
     </StackLayout>   
    `,
})
export class ListViewMainPageComponent { }
