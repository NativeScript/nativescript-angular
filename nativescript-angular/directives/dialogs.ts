import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Injectable,
    NgModuleRef,
    ReflectiveInjector,
    Type,
    ViewContainerRef,
} from "@angular/core";

import { NSLocationStrategy } from "../router/ns-location-strategy";
import { View, ViewBase } from "tns-core-modules/ui/core/view";
import { ProxyViewContainer } from "tns-core-modules/ui/proxy-view-container/proxy-view-container";

import { AppHostView } from "../app-host-view";
import { DetachedLoader } from "../common/detached-loader";
import { PageFactory, PAGE_FACTORY } from "../platform-providers";
import { once } from "../common/utils";
import { topmost, Frame, ShowModalOptions } from "tns-core-modules/ui/frame";

export type BaseShowModalOptions = Pick<ShowModalOptions, Exclude<keyof ShowModalOptions, "closeCallback" | "context">>;

export interface ModalDialogOptions extends BaseShowModalOptions {
    context?: any;
    viewContainerRef?: ViewContainerRef;
    moduleRef?: NgModuleRef<any>;
}

export class ModalDialogParams {
    constructor(
        public context: any = {},
        public closeCallback: (...args) => any) {
    }
}

interface ShowDialogOptions extends BaseShowModalOptions {
    context: any;
    containerRef: ViewContainerRef;
    doneCallback;
    pageFactory: PageFactory;
    parentView: ViewBase;
    resolver: ComponentFactoryResolver;
    type: Type<any>;
}

@Injectable()
export class ModalDialogService {
    constructor(private location: NSLocationStrategy) {
    }

    public showModal(type: Type<any>,
        options: ModalDialogOptions
    ): Promise<any> {
        if (!options.viewContainerRef) {
            throw new Error(
                "No viewContainerRef: " +
                "Make sure you pass viewContainerRef in ModalDialogOptions."
            );
        }

        let parentView = options.viewContainerRef.element.nativeElement;
        if (parentView instanceof AppHostView && parentView.ngAppRoot) {
            parentView = parentView.ngAppRoot;
        }

        // _ngDialogRoot is the first child of the previously detached proxy.
        // It should have 'viewController' (iOS) or '_dialogFragment' (Android) available for
        // presenting future modal views.
        if (parentView._ngDialogRoot) {
            parentView = parentView._ngDialogRoot;
        }

        const pageFactory: PageFactory = options.viewContainerRef.injector.get(PAGE_FACTORY);

        // resolve from particular module (moduleRef)
        // or from same module as parentView (viewContainerRef)
        const componentContainer = options.moduleRef || options.viewContainerRef;
        const resolver = componentContainer.injector.get(ComponentFactoryResolver);

        let frame = parentView;
        if (!(parentView instanceof Frame)) {
            frame = (parentView.page && parentView.page.frame) || topmost();
        }

        this.location._beginModalNavigation(frame);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    this._showDialog({
                        ...options,
                        containerRef: options.viewContainerRef,
                        context: options.context,
                        doneCallback: resolve,
                        pageFactory,
                        parentView,
                        resolver,
                        type,
                    });
                } catch (err) {
                    reject(err);
                }
            }, 10);
        });
    }

    private _showDialog(options: ShowDialogOptions): void {
        let componentView: View;
        let detachedLoaderRef: ComponentRef<DetachedLoader>;

        const closeCallback = once((...args) => {
            options.doneCallback.apply(undefined, args);
            if (componentView) {
                componentView.closeModal();
                this.location._closeModalNavigation();
                detachedLoaderRef.instance.detectChanges();
                detachedLoaderRef.destroy();
            }
        });

        const modalParams = new ModalDialogParams(options.context, closeCallback);
        const providers = ReflectiveInjector.resolve([
            { provide: ModalDialogParams, useValue: modalParams },
        ]);

        const childInjector = ReflectiveInjector.fromResolvedProviders(providers, options.containerRef.parentInjector);
        const detachedFactory = options.resolver.resolveComponentFactory(DetachedLoader);
        detachedLoaderRef = options.containerRef.createComponent(detachedFactory, -1, childInjector, null);
        detachedLoaderRef.instance.loadComponent(options.type).then((compRef) => {
            const detachedProxy = <ProxyViewContainer>compRef.location.nativeElement;

            if (detachedProxy.getChildrenCount() > 1) {
                throw new Error("Modal content has more than one root view.");
            }
            componentView = detachedProxy.getChildAt(0);

            if (componentView.parent) {
                (<any>componentView.parent)._ngDialogRoot = componentView;
                (<any>componentView.parent).removeChild(componentView);
            }

            options.parentView.showModal(componentView, { ...options, closeCallback });
        });
    }
}

@Directive({
    selector: "[modal-dialog-host]" // tslint:disable-line:directive-selector
})
export class ModalDialogHost { // tslint:disable-line:directive-class-suffix
    constructor() {
        throw new Error("ModalDialogHost is deprecated. " +
            "Call ModalDialogService.showModal() " +
            "by passing ViewContainerRef in the options instead."
        );
    }
}
