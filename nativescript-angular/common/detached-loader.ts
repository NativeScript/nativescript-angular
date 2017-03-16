import {
    ComponentRef, ComponentFactory, ViewContainerRef,
    Component, Type, ComponentFactoryResolver, ChangeDetectorRef
} from "@angular/core";
import { write } from "trace";

export const CATEGORY = "detached-loader";
function log(message: string) {
    write(message, CATEGORY);
}


/**
 * Wrapper component used for loading components when navigating
 * It uses DetachedContainer as selector so that it is containerRef is not attached to
 * the visual tree.
 */
@Component({
    selector: "DetachedContainer",
    template: `<Placeholder #loader></Placeholder>`
})
export class DetachedLoader { // tslint:disable-line:component-class-suffix
    constructor(
        private resolver: ComponentFactoryResolver,
        private changeDetector: ChangeDetectorRef,
        private containerRef: ViewContainerRef
    ) { }

    private loadInLocation(componentType: Type<any>): Promise<ComponentRef<any>> {
        const factory = this.resolver.resolveComponentFactory(componentType);
        const componentRef = this.containerRef.createComponent(
            factory, this.containerRef.length, this.containerRef.parentInjector);

        // Component is created, buit may not be checked if we are loading
        // inside component with OnPush CD strategy. Mark us for check to be sure CD will reach us.
        // We are inside a promise here so no need for setTimeout - CD should trigger
        // after the promise.
        log("DetachedLoader.loadInLocation component loaded -> markForCheck");

        return Promise.resolve(componentRef);
    }

    public detectChanges() {
        this.changeDetector.detectChanges();
    }

    // TODO: change this API -- async promises not needed here anymore.
    public loadComponent(componentType: Type<any>): Promise<ComponentRef<any>> {
        log("DetachedLoader.loadComponent");
        return this.loadInLocation(componentType);
    }

    public loadWithFactory<T>(factory: ComponentFactory<T>): ComponentRef<T> {
        return this.containerRef.createComponent(factory,
            this.containerRef.length, this.containerRef.parentInjector, null);
    }
}
