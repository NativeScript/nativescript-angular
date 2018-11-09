import { Component } from "@angular/core";

@Component({
  template: `
    <ActionBar title="Nested Page">
    </ActionBar>

    <GridLayout backgroundColor="gold">
        <StackLayout>
            <Button text="ShowActionBar" (tap)="showActionBar($event)"></Button>
            <Button text="HideActionBar" (tap)="hideActionBar($event)"></Button>
        </StackLayout>
    </GridLayout>
  `
})
export class NestedPageComponent {
    showActionBar(args): void {
        args.object.page.actionBarHidden = false;
    }

    hideActionBar(args): void {
        args.object.page.actionBarHidden = true;
    }
}
