import {DynamicComponentLoader, ReflectiveInjector, provide, Type, Injectable, ComponentRef, Directive, ViewChild, ViewContainerRef} from 'angular2/core';
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
    private viewContainerRef: ViewContainerRef;

    constructor(
        private page: Page,
        private loader: DynamicComponentLoader) {
    }

    public registerViewContainerRef(ref: ViewContainerRef) {
        this.viewContainerRef = ref;
    }

    public showModal(type: Type, options: ModalDialogOptions): Promise<any> {
        if (!this.viewContainerRef) {
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
             
            this.loader.loadNextToLocation(DetachedLoader, this.viewContainerRef, providers)
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

    constructor(viewContainerRef: ViewContainerRef, modalService: ModalDialogService) {
        modalService.registerViewContainerRef(viewContainerRef);
    }
} 
