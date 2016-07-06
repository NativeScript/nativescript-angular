import { Component } from "@angular/core";
import { NS_ROUTER_DIRECTIVES } from "nativescript-angular/router";

@Component({
    selector: "main",
    directives: [NS_ROUTER_DIRECTIVES],
    template: `
    <StackLayout>
        <Button text="ListView" [nsRouterLink]="['/listView','commonTemplate']"></Button>        
        <Button text="ListViewCustomTemplate" [nsRouterLink]="['/listView','customTemplate']"></Button>
        <Button text="ListViewAsyncPipe" [nsRouterLink]="['/listView','asyncPipeTemplate']"></Button>  
     </StackLayout>   
    `,
})
export class ListViewMainPageComponent { }
