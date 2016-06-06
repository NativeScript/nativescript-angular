import { Component } from "@angular/core";
import { NS_ROUTER_DIRECTIVES } from "nativescript-angular/router";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Button text="ListView" [nsRouterLink]="['ListView']"></Button>        
        <Button text="ListViewCustomTemplate" [nsRouterLink]="['ListViewCustomTemplate']"></Button>
        <Button text="ListViewAsyncPipe" [nsRouterLink]="['ListViewAsyncPipe']"></Button>  
     </StackLayout>   
    `,
})
export class ListViewMainPageComponent { }
