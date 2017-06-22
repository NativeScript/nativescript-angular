import { Component } from "@angular/core";

@Component({
    selector: "tab-view-component",
    template: `
    <Grid class="tab-view-container">
        <TabView sdkExampleTitle sdkToggleNavButton>
            <StackLayout *tabItem="{title: 'Overview'}" >
                <Label text="Test Label"></Label>
            </StackLayout>
        </TabView>
    </Grid>
            `,
})

export class TabViewComponent {
}
