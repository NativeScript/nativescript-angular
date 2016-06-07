import {ComponentRef, ViewContainerRef, Component, Type, ViewChild, ComponentResolver, ChangeDetectorRef, Host} from '@angular/core';
import trace = require("trace");

type AnyComponentRef = ComponentRef<any>;
interface PendingLoadEntry {
    componentType: Type;
    resolveCallback: (AnyComponentRef) => void;
}

export const CATEGORY = "detached-loader";
function log(message: string) {
    trace.write(message, CATEGORY);
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

    constructor(private compiler: ComponentResolver, private changeDetector: ChangeDetectorRef) { }

    public ngAfterViewInit() {
        log("DetachedLoader.ngAfterViewInit");

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
        }).then((compRef) => {
            log("DetachedLoader.loadInLocation component loaded -> markForCheck");
            // Component is created, buit may not be checked if we are loading 
            // inside component with OnPush CD strategy. Mark us for check to be sure CD will reach us.
            // We are inside a promise here so no need for setTimeout - CD should trigger after the promise.
            this.changeDetector.markForCheck();
            return compRef;
        })
    }

    public loadComponent(componentType: Type): Promise<ComponentRef<any>> {
        log("DetachedLoader.loadComponent viewLoaded: " + this.viewLoaded);

        // Check if called before placeholder is initialized.
        // Delay load if so.
        if (this.viewLoaded) {
            return this.loadInLocation(componentType);
        } else {
            // loadComponent called, but detached-loader is still not initialized.
            // Mark it for change and trigger change detection to be sure it will be initialized,
            // so that loading can conitionue.
            log("DetachedLoader.loadComponent -> markForCheck(with setTimeout())")
            setTimeout(() => this.changeDetector.markForCheck(), 0);
            
            return new Promise((resolve, reject) => {
                this.pendingLoads.push({
                    componentType: componentType,
                    resolveCallback: resolve
                });
            });
        }
    }
}
