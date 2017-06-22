import { Component } from "@angular/core";

@Component({
    template: `
            <Grid class="tab-view-container">
                <TabView>
                    <StackLayout *tabItem="{title: 'no scroll'}">
                        <DatePicker></DatePicker>
                    </StackLayout>
                    <StackLayout *tabItem="{title: 'with scroll'}">
                        <ScrollView>
                            <StackLayout>
                            <DatePicker></DatePicker>
                            </StackLayout>
                        </ScrollView>
                    </StackLayout>
                </TabView>
            </Grid>
            `,
})

export class DatePickerIssue324Component {
}
