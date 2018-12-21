import { Component } from "@angular/core";

@Component({
    styles: ["Button { font-size: 10; margin: 0; padding: 0 }"],
    template: `
        <FlexboxLayout flexDirection="column" >
            <Button text="ActionBar dynamic" [nsRouterLink]="['/action-bar-dynamic']"></Button>
            <Button text="ActionBarExtension" [nsRouterLink]="['/action-bar-extension']"></Button>
            <Button text="ActionBarVisibility Always" [nsRouterLink]="['/action-bar-visibility-always']"></Button>
            <Button text="ActionBarVisibility Never" [nsRouterLink]="['/action-bar-visibility-never']"></Button>
            <Button text="ActionBarVisibility Auto" [nsRouterLink]="['/action-bar-visibility-auto']"></Button>
            <Button text="ActionBarVisibility Never Lazy" [nsRouterLink]="['/action-bar-visibility-never-lazy']"></Button>
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
