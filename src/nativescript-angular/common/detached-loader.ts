import {DynamicComponentLoader, ComponentRef, ElementRef, Component, Type} from 'angular2/core';

/**
 * Page shim used for loading compnenets when navigating
 */
@Component({
    selector: 'nativescript-page-shim',
    template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>
        `
})
export class DetachedLoader {
    constructor(
        private element: ElementRef,
        private loader: DynamicComponentLoader
    ) {
    }

    public loadComponent(componentType: Type): Promise<ComponentRef> {
        return this.loader.loadIntoLocation(componentType, this.element, 'loader');
    }
}