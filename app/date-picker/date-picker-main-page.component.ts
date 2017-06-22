import { Component } from "@angular/core";

@Component({
    template: `
    <StackLayout>
        <Button text="issue-649" [nsRouterLink]="['issue-324']"></Button>
     </StackLayout>
    `,
})
export class DatePickerMainPageComponent { }
