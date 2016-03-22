import {DynamicComponentLoader, ElementRef, Injector, provide, Type, Injectable, ComponentRef} from 'angular2/core';
import {Page} from 'ui/page';
import {View} from 'ui/core/view';
import {DetachedLoader} from '../common/detached-loader';

export class ModalDialogOptions {
    constructor(
        public context: any = {},
        public fullscreen: boolean = true) {
    }
}

export class ModalDialogParams {
    constructor(
        public context: any = {},
        public closeCallback: (...args) => any) {
    }
}

@Injectable()
export class ModalDialogService {
    constructor(
        private page: Page,
        private loader: DynamicComponentLoader) {
    }

    public showModal(type: Type, elementRef: ElementRef, options: ModalDialogOptions): Promise<any> {
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
            
            this.loader.loadNextToLocation(DetachedLoader, elementRef, providers)
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