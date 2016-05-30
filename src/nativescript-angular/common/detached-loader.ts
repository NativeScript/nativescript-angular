import {ComponentRef, ViewContainerRef, Component, Type, ViewChild, ComponentResolver} from '@angular/core';

type AnyComponentRef = ComponentRef<any>;
interface PendingLoadEntry {
    componentType: Type;
    resolveCallback: (AnyComponentRef) => void;
}

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

    private viewLoaded = false;
    private pendingLoads: PendingLoadEntry[] = [];

    constructor(private compiler: ComponentResolver) {
    }

    public ngAfterViewInit() {
        this.viewLoaded = true;
        this.pendingLoads.forEach(loadEntry => {
            this.loadInLocation(loadEntry.componentType).then(loadedRef => {
                loadEntry.resolveCallback(loadedRef);
            });
        });
    }

    private loadInLocation(componentType: Type): Promise<ComponentRef<any>> {
        return this.compiler.resolveComponent(componentType).then((componentFactory) => {
            return this.containerRef.createComponent(componentFactory, this.containerRef.length, this.containerRef.parentInjector, null);
        });
    }

    public loadComponent(componentType: Type): Promise<ComponentRef<any>> {
        // Check if called before placeholder is initialized.
        // Delay load if so.
        if (this.viewLoaded) {
            return this.loadInLocation(componentType);
        } else {
            return new Promise((resolve, reject) => {
                this.pendingLoads.push({
                    componentType: componentType,
                    resolveCallback: resolve
                });
            });
        }
    }
}
