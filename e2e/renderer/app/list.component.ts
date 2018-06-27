import { Component } from "@angular/core";

@Component({
    template: `
        <FlexboxLayout flexDirection="column">
            <Button text="ActionBar dynamic" [nsRouterLink]="['/action-bar-dynamic']"></Button>
            <Button text="ActionBarExtension" [nsRouterLink]="['/action-bar-extension']"></Button>
            <Button text="TabItem Binding" [nsRouterLink]="['/tab-item-binding']"></Button>
            <Button text="NgFor" [nsRouterLink]="['/ngfor']"></Button>
            <Button text="NgForOf" [nsRouterLink]="['/ngforof']"></Button>
            <Button text="NgIf no layout" [nsRouterLink]="['/ngif-no-layout']"></Button>
            <Button text="NgIf inbetween" [nsRouterLink]="['/ngif-inbetween']"></Button>
            <Button text="NgIfElse" [nsRouterLink]="['/ngifelse']"></Button>
            <Button text="NgIf Then Else" [nsRouterLink]="['/ngif-then-else']"></Button>
            <Button text="NgIf Subsequent Ifs" [nsRouterLink]="['/ngif-subsequent']"></Button>
            <Button text="Content view" [nsRouterLink]="['/content-view']"></Button>
        </FlexboxLayout>
    `
})
export class ListComponent {
}
