import { Component } from "@angular/core";

@Component({
    template: `
    <StackLayout>
              <Button text="issue-649" [nsRouterLink]="['issue-649']"></Button>
     </StackLayout>
    `,
})
export class SegmentedBarMainPageComponent { }