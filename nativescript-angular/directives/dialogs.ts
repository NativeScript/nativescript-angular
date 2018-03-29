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

import { Page } from "tns-core-modules/ui/page";
import { View, ViewBase } from "tns-core-modules/ui/core/view";

import { AppHostView } from "../app-host-view";
import { DetachedLoader } from "../common/detached-loader";
import { PageFactory, PAGE_FACTORY } from "../platform-providers";

export interface ModalDialogOptions {
    context?: any;
    fullscreen?: boolean;
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
    pageFactory: PageFactory;
    parentView: ViewBase;
    resolver: ComponentFactoryResolver;
    type: Type<any>;
}

@Injectable()
export class ModalDialogService {
    public showModal(type: Type<any>,
        { viewContainerRef, moduleRef, context, fullscreen }: ModalDialogOptions
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

        const pageFactory: PageFactory = viewContainerRef.injector.get(PAGE_FACTORY);

        // resolve from particular module (moduleRef)
        // or from same module as parentView (viewContainerRef)
        const componentContainer = moduleRef || viewContainerRef;
        const resolver = componentContainer.injector.get(ComponentFactoryResolver);

        return new Promise(resolve => {
            setTimeout(() => ModalDialogService.showDialog({
                containerRef: viewContainerRef,
                context,
                doneCallback: resolve,
                fullscreen,
                pageFactory,
                parentView,
                resolver,
                type,
            }), 10);
        });
    }

    private static showDialog({
        containerRef,
        context,
        doneCallback,
        fullscreen,
        pageFactory,
        parentView,
        resolver,
        type,
    }: ShowDialogOptions): void {
        const page = pageFactory({ isModal: true, componentType: type });

        let detachedLoaderRef: ComponentRef<DetachedLoader>;
        const closeCallback = (...args) => {
            doneCallback.apply(undefined, args);
            page.closeModal();
            detachedLoaderRef.instance.detectChanges();
            detachedLoaderRef.destroy();
        };

        const modalParams = new ModalDialogParams(context, closeCallback);

        const providers = ReflectiveInjector.resolve([
            { provide: Page, useValue: page },
            { provide: ModalDialogParams, useValue: modalParams },
        ]);

        const childInjector = ReflectiveInjector.fromResolvedProviders(
            providers, containerRef.parentInjector);
        const detachedFactory = resolver.resolveComponentFactory(DetachedLoader);
        detachedLoaderRef = containerRef.createComponent(detachedFactory, -1, childInjector, null);
        detachedLoaderRef.instance.loadComponent(type).then((compRef) => {
            const componentView = <View>compRef.location.nativeElement;

            if (componentView.parent) {
                (<any>componentView.parent).removeChild(componentView);
            }

            page.content = componentView;
            parentView.showModal(page, context, closeCallback, fullscreen);
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
