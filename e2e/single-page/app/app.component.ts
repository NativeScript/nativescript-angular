import { Component } from "@angular/core";

@Component({
    template: `
        <GridLayout rows="* auto">
            <router-outlet></router-outlet>

            <FlexboxLayout class="nav" row="1">
                <Button text="FIRST" nsRouterLinkActive="active" nsRouterLink="/first"></Button>
                <Button text="SECOND(1)" nsRouterLinkActive="active" nsRouterLink="/second/1"></Button>
                <Button text="SECOND(2)" nsRouterLinkActive="active" [nsRouterLink]="['/second', '2' ]">
                </Button>
            </FlexboxLayout>
            
        </GridLayout>
    `
})
export class AppComponent { }

