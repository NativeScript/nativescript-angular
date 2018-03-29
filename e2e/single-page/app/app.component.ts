import { Component } from "@angular/core";

@Component({
    template: `
        <GridLayout rows="* auto">
            <router-outlet></router-outlet>

            <StackLayout class="nav" row="1">
                <Button text="First" nsRouterLinkActive="active" nsRouterLink="/first"></Button>
                <Button text="Second(1)" nsRouterLinkActive="active" nsRouterLink="/second/1"></Button>
                <Button text="Second(2)" nsRouterLinkActive="active" [nsRouterLink]="['/second', '2' ]">
                </Button>
            </StackLayout>
            
        </GridLayout>
    `
})
export class AppComponent { }

