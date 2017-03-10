import {
    ReflectiveInjector, ComponentFactoryResolver, ViewContainerRef,
    Type, Injectable, ComponentRef, Directive
} from "@angular/core";
import { Page } from "tns-core-modules/ui/page";
import { View } from "tns-core-modules/ui/core/view";
import { DetachedLoader } from "../common/detached-loader";
import { PageFactory, PAGE_FACTORY } from "../platform-providers";

export interface ModalDialogOptions {
    context?: any;
    fullscreen?: boolean;
    viewContainerRef?: ViewContainerRef;
}

export class ModalDialogParams {
    constructor(
        public context: any = {},
        public closeCallback: (...args) => any) {
    }
}

@Injectable()
export class ModalDialogService {
    public showModal(type: Type<any>, options: ModalDialogOptions): Promise<any> {
        if (!options.viewContainerRef) {
            throw new Error(
                "No viewContainerRef: Make sure you pass viewContainerRef in ModalDialogOptions.");
        }

        const viewContainerRef = options.viewContainerRef;
        const parentPage: Page = viewContainerRef.injector.get(Page);
        const resolver: ComponentFactoryResolver = viewContainerRef.injector.get(
            ComponentFactoryResolver);
        const pageFactory: PageFactory = viewContainerRef.injector.get(PAGE_FACTORY);

        return new Promise((resolve) => {
            setTimeout(() => ModalDialogService.showDialog(
                type,
                options,
                resolve,
                viewContainerRef,
                resolver,
                parentPage,
                pageFactory
            ), 10);
        });
    }

    private static showDialog(
        type: Type<any>,
        options: ModalDialogOptions,
        doneCallback,
        containerRef: ViewContainerRef,
        resolver: ComponentFactoryResolver,
        parentPage: Page,
        pageFactory: PageFactory): void {

        const page = pageFactory({ isModal: true, componentType: type });

        let detachedLoaderRef: ComponentRef<DetachedLoader>;
        const closeCallback = (...args) => {
            doneCallback.apply(undefined, args);
            page.closeModal();
            detachedLoaderRef.instance.detectChanges();
            detachedLoaderRef.destroy();
        };

        const modalParams = new ModalDialogParams(options.context, closeCallback);

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
            parentPage.showModal(page, options.context, closeCallback, options.fullscreen);
        });
    }
}


@Directive({
    selector: "[modal-dialog-host]" // tslint:disable-line:directive-selector
})
export class ModalDialogHost { // tslint:disable-line:directive-class-suffix
    constructor() {
        throw new Error("ModalDialogHost is deprecated. Call ModalDialogService.showModal() " +
            "by passing ViewContainerRef in the options instead.");
    }
}
