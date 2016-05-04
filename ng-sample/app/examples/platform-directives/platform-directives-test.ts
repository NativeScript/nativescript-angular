import {Component} from '@angular/core';

@Component({
    selector: 'action-bar-test',
    template: `
    <StackLayout>
        <android><Label text="This is Android specific content"></Label></android>
        <ios><Label text="This is IOS specific content"></Label></ios>
        <Label 
            android:text="Android specific attribute"
            ios:text="Ios specific attribute"></Label>
    </StackLayout>
    `
})
export class PlatfromDirectivesTest {
}


