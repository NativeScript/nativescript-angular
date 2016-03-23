import {DynamicComponentLoader, ComponentRef, ElementRef, Component, Type} from 'angular2/core';

/**
 * Wrapper component used for loading compnenets when navigating
 * It uses DetachedContainer as selector so that it is elementRef is not attached to the visual tree.
 */
@Component({
    selector: 'DetachedContainer', 
    template: `<Placeholder #loader></Placeholder>`
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