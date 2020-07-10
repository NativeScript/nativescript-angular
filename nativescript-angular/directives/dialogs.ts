import {
    ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    Injector,
    NgModuleRef,
    Type,
    ViewContainerRef
} from '@angular/core';
import { Frame, View, ViewBase, ProxyViewContainer, ShowModalOptions } from '@nativescript/core';

import { NSLocationStrategy } from '../router/ns-location-strategy';
import { AppHostView } from '../app-host-view';
import { DetachedLoader } from '../common/detached-loader';
import { PageFactory, PAGE_FACTORY } from '../platform-providers';
import { once } from '../common/utils';

export type BaseShowModalOptions = Pick<ShowModalOptions, Exclude<keyof ShowModalOptions, 'closeCallback' | 'context'>>;

export interface ModalDialogOptions extends BaseShowModalOptions {
    context?: any;
    viewContainerRef?: ViewContainerRef;
    moduleRef?: NgModuleRef<any>;
    target?: View;
}

export interface ShowDialogOptions extends BaseShowModalOptions {
  containerRef: ViewContainerRef;
  context: any;
  doneCallback;
  pageFactory: PageFactory;
  parentView: ViewBase;
  resolver: ComponentFactoryResolver;
  type: Type<any>;
}

export class ModalDialogParams {
    constructor(
        public context: any = {},
        public closeCallback: (...args) => any) {
    }
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
                'No viewContainerRef: ' +
                'Make sure you pass viewContainerRef in ModalDialogOptions.'
            );
        }

        let parentView = options.viewContainerRef.element.nativeElement;
        if (options.target) {
            parentView = options.target;
        }

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
            frame = (parentView.page && parentView.page.frame) || Frame.topmost();
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
                        type
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

        const childInjector = Injector.create({
            providers: [{ provide: ModalDialogParams, useValue: modalParams }],
            parent: options.containerRef.injector
        });
        const detachedFactory = options.resolver.resolveComponentFactory(DetachedLoader);
        detachedLoaderRef = options.containerRef.createComponent(detachedFactory, 0, childInjector, null);
        detachedLoaderRef.instance.loadComponent(options.type).then((compRef) => {
            const detachedProxy = <ProxyViewContainer>compRef.location.nativeElement;

            if (detachedProxy.getChildrenCount() > 1) {
                throw new Error('Modal content has more than one root view.');
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
