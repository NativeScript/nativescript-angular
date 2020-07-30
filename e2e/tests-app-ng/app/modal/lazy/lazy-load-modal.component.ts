import {
    Component,
    ComponentFactory,
    NgModuleFactory,
    NgModuleFactoryLoader,
    ViewContainerRef,
} from "@angular/core";

import { NSModuleFactoryLoader, ModalDialogService } from "@nativescript/angular";

import { LazyComponent } from "../../lazy/lazy.component";

@Component({
    template: `
        <Button text="Load modal!" (tap)="openModal()"></Button>
    `
})
export class LazyLoadModalComponent {
    constructor(
        private moduleLoader: NgModuleFactoryLoader,
        private vcRef: ViewContainerRef,
        private modalService: ModalDialogService
    ) { }

    public openModal() {
        this.moduleLoader.load("./lazy/lazy.module#LazyModule")
            .then((module: NgModuleFactory<any>) => {
                const moduleRef = module.create(this.vcRef.parentInjector);

                this.modalService.showModal(LazyComponent, {
                    moduleRef,
                    viewContainerRef: this.vcRef,
                    context: { isModal: true }
                });
            });
    }
}
