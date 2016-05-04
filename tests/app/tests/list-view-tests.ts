import {assert} from "./test-config";
import {
    ElementRef,
    Component
} from '@angular/core';
import {TestApp} from "./test-app";
import {device, platformNames} from "platform";
const IS_IOS = (device.os === platformNames.ios);

class DataItem {
    constructor(public id: number, public name: string) { }
}

@Component({
    selector: 'list-view-setupItemView',
    template: `
    <StackLayout>
        <ListView height="200" [items]="myItems" (setupItemView)="onSetupItemView($event)">
            <template #item="item" #i="index" #odd="odd" #even="even">
                <StackLayout [class.odd]="odd" [class.even]="even">
                    <Label [text]='"index: " + i'></Label>
                    <Label [text]='"[" + item.id +"] " + item.name'></Label>
                </StackLayout>
            </template>
        </ListView>
    </StackLayout>
    `
})
export class TestListViewComponent {
    public myItems: Array<DataItem>;
    public counter: number;

    constructor(public elementRef: ElementRef) {
        this.counter = 0;
        this.myItems = [];
        for (var i = 0; i < 2; i++) {
            this.myItems.push(new DataItem(i, "data item " + i));
        }
    }

    onSetupItemView(args) {
        this.counter++;
    }
}

// TODO: Skip list-view test until karma test launcher double navigate bug is fixed
describe.skip('ListView-tests', () => {
    let testApp: TestApp = null;

    before(() => {
        return TestApp.create().then((app) => {
            testApp = app;
        })
    });

    after(() => {
        testApp.dispose();
    });

    afterEach(() => {
        testApp.disposeComponents();
    });

    it('setupItemView is called for every item', (done) => {
        return testApp.loadComponent(TestListViewComponent).then((componentRef) => {
            const component = componentRef.instance;
            setTimeout(() => {
                console.log("component: " + component);
                assert.equal(component.counter, 2);
                done();
            }, 1000);
        })
        .catch(done);
    });
});
