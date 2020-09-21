import { ComponentRef, ComponentFactory, ViewContainerRef, Component, Type, ComponentFactoryResolver, ChangeDetectorRef, ApplicationRef, OnDestroy } from '@angular/core';
import { Trace } from '@nativescript/core';

/**
 * Wrapper component used for loading components when navigating
 * It uses DetachedContainer as selector so that it is containerRef is not attached to
 * the visual tree.
 */
@Component({
	selector: 'DetachedContainer',
	template: `<Placeholder #loader></Placeholder>`,
})
export class DetachedLoader implements OnDestroy {
	private disposeFunctions: Array<() => void> = [];
	// tslint:disable-line:component-class-suffix
	constructor(private resolver: ComponentFactoryResolver, private changeDetector: ChangeDetectorRef, private containerRef: ViewContainerRef, private appRef: ApplicationRef) {}

	private loadInLocation(componentType: Type<any>): Promise<ComponentRef<any>> {
		const factory = this.resolver.resolveComponentFactory(componentType);
		const componentRef = factory.create(this.containerRef.injector);
		this.appRef.attachView(componentRef.hostView);

		this.disposeFunctions.push(() => {
			this.appRef.detachView(componentRef.hostView);
			componentRef.destroy();
		});

		// Component is created, built may not be checked if we are loading
		// inside component with OnPush CD strategy. Mark us for check to be sure CD will reach us.
		// We are inside a promise here so no need for setTimeout - CD should trigger
		// after the promise.
		Trace.write('DetachedLoader.loadInLocation component loaded -> markForCheck', 'detached-loader');

		return Promise.resolve(componentRef);
	}

	public ngOnDestroy() {
		this.disposeFunctions.forEach((fn) => fn());
	}

	public detectChanges() {
		this.changeDetector.markForCheck();
	}

	// TODO: change this API -- async promises not needed here anymore.
	public loadComponent(componentType: Type<any>): Promise<ComponentRef<any>> {
		Trace.write('DetachedLoader.loadComponent', 'detached-loader');
		return this.loadInLocation(componentType);
	}

	public loadWithFactory<T>(factory: ComponentFactory<T>): ComponentRef<T> {
		const componentRef = factory.create(this.containerRef.injector);
		this.appRef.attachView(componentRef.hostView);

		this.disposeFunctions.push(() => {
			this.appRef.detachView(componentRef.hostView);
			componentRef.destroy();
		});
		return componentRef;
	}
}
