import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    IterableDiffers,
    forwardRef
} from '@angular/core';
import { ListView } from '@nativescript/core/ui/list-view';
import { TEMPLATED_ITEMS_COMPONENT, TemplatedItemsComponent } from './templated-items-comp';

@Component({
    selector: 'ListView',
    template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: TEMPLATED_ITEMS_COMPONENT, useExisting: forwardRef(() => ListViewComponent)}]
})
export class ListViewComponent extends TemplatedItemsComponent {
    public get nativeElement(): ListView {
        return this.templatedItemsView;
    }

    protected templatedItemsView: ListView;

    constructor(_elementRef: ElementRef,
        _iterableDiffers: IterableDiffers) {
        super(_elementRef, _iterableDiffers);
    }
}
