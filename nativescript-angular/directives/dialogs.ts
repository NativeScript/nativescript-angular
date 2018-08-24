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
import { Frame } from "tns-core-modules/ui/frame/frame";

export interface ModalDialogOptions {
    context?: any;
    fullscreen?: boolean;
    animated?: boolean;
    stretched?: boolean;
    viewContainerRef?: ViewContainerRef;
    moduleRef?: NgModuleRef<any>;
}

export class ModalDialogParams {
    constructor(
        public context: any = {},
        public closeCallback: (...args) => any) {
    }
}

interface ShowDialogOptions {
    containerRef: ViewContainerRef;
    context: any;
    doneCallback;
    fullscreen: boolean;
    animated: boolean;
    stretched: boolean;
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
        { viewContainerRef, moduleRef, context, fullscreen, animated, stretched }: ModalDialogOptions
    ): Promise<any> {
        if (!viewContainerRef) {
            throw new Error(
                "No viewContainerRef: " +
                "Make sure you pass viewContainerRef in ModalDialogOptions."
            );
        }

        let parentView = viewContainerRef.element.nativeElement;
        if (parentView instanceof AppHostView && parentView.ngAppRoot) {
            parentView = parentView.ngAppRoot;
        }

        // _ngDialogRoot is the first child of the previously detached proxy.
        // It should have 'viewController' (iOS) or '_dialogFragment' (Android) available for
        // presenting future modal views.
        if (parentView._ngDialogRoot) {
            parentView = parentView._ngDialogRoot;
        }

        const pageFactory: PageFactory = viewContainerRef.injector.get(PAGE_FACTORY);

        // resolve from particular module (moduleRef)
        // or from same module as parentView (viewContainerRef)
        const componentContainer = moduleRef || viewContainerRef;
        const resolver = componentContainer.injector.get(ComponentFactoryResolver);

        let frame = parentView;
        if (!(parentView instanceof Frame)) {
            frame = parentView.page && parentView.page.frame;
        }

        if (frame) {
            this.location._beginModalNavigation(frame);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    this._showDialog({
                        containerRef: viewContainerRef,
                        context,
                        doneCallback: resolve,
                        fullscreen,
                        animated,
                        stretched,
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

    private _showDialog({
        containerRef,
        context,
        doneCallback,
        fullscreen,
        animated,
        stretched,
        pageFactory,
        parentView,
        resolver,
        type,
    }: ShowDialogOptions): void {
        let componentView: View;
        let detachedLoaderRef: ComponentRef<DetachedLoader>;

        const closeCallback = once((...args) => {
            doneCallback.apply(undefined, args);
            if (componentView) {
                componentView.closeModal();
                this.location._finishCloseModalNavigation();
                detachedLoaderRef.instance.detectChanges();
                detachedLoaderRef.destroy();
            }
        });

        const modalParams = new ModalDialogParams(context, closeCallback);
        const providers = ReflectiveInjector.resolve([
            { provide: ModalDialogParams, useValue: modalParams },
        ]);

        const childInjector = ReflectiveInjector.fromResolvedProviders(providers, containerRef.parentInjector);
        const detachedFactory = resolver.resolveComponentFactory(DetachedLoader);
        detachedLoaderRef = containerRef.createComponent(detachedFactory, -1, childInjector, null);
        detachedLoaderRef.instance.loadComponent(type).then((compRef) => {
            const detachedProxy = <ProxyViewContainer>compRef.location.nativeElement;

            if (detachedProxy.getChildrenCount() > 1) {
                throw new Error("Modal content has more than one root view.");
            }
            componentView = detachedProxy.getChildAt(0);

            if (componentView.parent) {
                (<any>componentView.parent)._ngDialogRoot = componentView;
                (<any>componentView.parent).removeChild(componentView);
            }

            // TODO: remove <any> cast after https://github.com/NativeScript/NativeScript/pull/5734
            // is in a published version of tns-core-modules.
            (<any>parentView).showModal(componentView, context, closeCallback, fullscreen, animated, stretched);
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
