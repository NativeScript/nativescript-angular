import {DynamicComponentLoader, ComponentRef, ViewContainerRef, Component, Type, ViewChild} from 'angular2/core';

/**
 * Wrapper component used for loading components when navigating
 * It uses DetachedContainer as selector so that it is containerRef is not attached to the visual tree.
 */
@Component({
    selector: 'DetachedContainer', 
    template: `<Placeholder #loader></Placeholder>`
})
export class DetachedLoader {
    
    @ViewChild('loader', { read: ViewContainerRef }) containerRef: ViewContainerRef;
    
    constructor(
        private loader: DynamicComponentLoader
    ) {
    }

    public loadComponent(componentType: Type): Promise<ComponentRef> {
        return this.loader.loadNextToLocation(componentType, this.containerRef);
    }
}