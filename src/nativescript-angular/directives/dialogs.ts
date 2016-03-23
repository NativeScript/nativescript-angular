import {DynamicComponentLoader, ElementRef, Injector, provide, Type, Injectable, ComponentRef, Directive} from 'angular2/core';
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
    private elementRef: ElementRef;

    constructor(
        private page: Page,
        private loader: DynamicComponentLoader) {
    }

    public registerElementRef(ref: ElementRef) {
        this.elementRef = ref;
    }

    public showModal(type: Type, options: ModalDialogOptions): Promise<any> {
        if (!this.elementRef) {
            throw new Error("No elementRef: Make sure you have the modal-dialog-host directive inside your component.");
        }
        return new Promise((resove, reject) => {
            const page = new Page();

            var detachedLoaderRef: ComponentRef;
            const closeCallback = (...args) => {
                resove.apply(undefined, args);
                page.closeModal();
                detachedLoaderRef.dispose();
            }
            const modalParams = new ModalDialogParams(options.context, closeCallback);

            const providers = Injector.resolve([
                provide(Page, { useValue: page }),
                provide(ModalDialogParams, { useValue: modalParams }),
            ]);

            this.loader.loadNextToLocation(DetachedLoader, this.elementRef, providers)
                .then((loaderRef) => {
                    detachedLoaderRef = loaderRef;
                    return (<DetachedLoader>loaderRef.instance).loadComponent(type)
                })
                .then((compRef) => {
                    //Component loaded. Find its root native view.
                    const componenetView = <View>compRef.location.nativeElement;
                    if (componenetView.parent) {
                        (<any>componenetView.parent).removeChild(componenetView);
                    }
                    page.content = componenetView;
                    (<any>page)._showNativeModalView(this.page, options.context, closeCallback, options.fullscreen);
                });
        })
    }
}


@Directive({
    selector: "[modal-dialog-host]"
})
export class ModalDialogHost {
    constructor(elementRef: ElementRef, modalService: ModalDialogService) {
        modalService.registerElementRef(elementRef);
    }
} 
