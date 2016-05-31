import {ReflectiveInjector, ComponentResolver, ViewContainerRef, Injector, provide, Type, Injectable, ComponentRef, Directive} from '@angular/core';
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
        private compiler: ComponentResolver) {
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

            var detachedLoaderRef: ComponentRef<DetachedLoader>;
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

            this.compiler.resolveComponent(DetachedLoader).then((detachedFactory) => {
                const childInjector = ReflectiveInjector.fromResolvedProviders(providers, this.containerRef.parentInjector);
                detachedLoaderRef = this.containerRef.createComponent(detachedFactory, -1, childInjector, null)
                
                detachedLoaderRef.instance.loadComponent(type).then((compRef) => {
                    const componentView = <View>compRef.location.nativeElement;
                    
                    if (componentView.parent) {
                        (<any>componentView.parent).removeChild(componentView);
                    }
                    
                    page.content = componentView;
                    this.page.showModal(page, options.context, closeCallback, options.fullscreen);
                });
            });
        });
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
