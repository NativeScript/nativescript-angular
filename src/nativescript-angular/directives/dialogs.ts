import {ReflectiveInjector, DynamicComponentLoader, ViewContainerRef, Injector, provide, Type, Injectable, ComponentRef, Directive} from '@angular/core';
import {Page} from 'ui/page';
import {View} from 'ui/core/view';
import {DetachedLoader} from '../common/detached-loader';

export interface ModalDialogOptions {
    context?: any;
    fullscreen?: boolean;
}

export class ModalDialogParams {
    constructor(
        public context: any = {},
        public closeCallback: (...args) => any) {
    }
}

@Injectable()
export class ModalDialogService {
    private containerRef: ViewContainerRef;

    constructor(
        private page: Page,
        private loader: DynamicComponentLoader) {
    }

    public registerViewContainerRef(ref: ViewContainerRef) {
        this.containerRef = ref;
    }

    public showModal(type: Type, options: ModalDialogOptions): Promise<any> {
        if (!this.containerRef) {
            throw new Error("No viewContainerRef: Make sure you have the modal-dialog-host directive inside your component.");
        }
        return new Promise((resove, reject) => {
            const page = new Page();

            var detachedLoaderRef: ComponentRef;
            const closeCallback = (...args) => {
                resove.apply(undefined, args);
                page.closeModal();
                detachedLoaderRef.destroy();
            }
            const modalParams = new ModalDialogParams(options.context, closeCallback);

            const providers = ReflectiveInjector.resolve([
                provide(Page, { useValue: page }),
                provide(ModalDialogParams, { useValue: modalParams }),
            ]);

            this.loader.loadNextToLocation(DetachedLoader, this.containerRef, providers)
                .then((loaderRef) => {
                    detachedLoaderRef = loaderRef;
                    return (<DetachedLoader>loaderRef.instance).loadComponent(type)
                })
                .then((compRef) => {
                    //Component loaded. Find its root native view.
                    const componentView = <View>compRef.location.nativeElement;
                    if (componentView.parent) {
                        (<any>componentView.parent).removeChild(componentView);
                    }
                    page.content = componentView;
                    this.page.showModal(page, options.context, closeCallback, options.fullscreen);
                });
        })
    }
}


@Directive({
    selector: "[modal-dialog-host]"
})
export class ModalDialogHost {
    constructor(containerRef: ViewContainerRef, modalService: ModalDialogService) {
        modalService.registerViewContainerRef(containerRef);
    }
} 
