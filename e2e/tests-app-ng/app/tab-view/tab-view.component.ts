import { Component, OnInit } from "@angular/core";

@Component({
    selector: "tab-view-component",
    template: `
    <Grid class="tab-view-container">
    <TabView>
        <StackLayout *tabItem="{ title: 'Tab1' }">
            <GridLayout>
                <Label *ngIf="isLoading" text="First tab item is still loading"></Label>
                <Label *ngIf="!isLoading" text="First tab item"></Label>
            </GridLayout>
        </StackLayout>
        <StackLayout *tabItem="{ title: 'Tab2' }">
            <Label text="Second tab item"></Label>
        </StackLayout>
    </TabView>
    </Grid>
            `,
})

export class TabViewComponent implements OnInit {
    public isLoading: boolean = true;

    public ngOnInit(): void {
        setTimeout(() => {
            this.isLoading = false;
        }, 500);
    }
}
