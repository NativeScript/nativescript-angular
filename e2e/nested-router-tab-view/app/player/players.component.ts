import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { DataService, DataItem } from "../data.service";

import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular/directives/dialogs";
import { ModalRouterComponent } from "../modal/modal-router/modal-router.component";
@Component({
    selector: "ns-players",
    moduleId: module.id,
    templateUrl: "./players.component.html",
})
export class PlayerComponent implements OnInit {
    items: DataItem[];

    constructor(
        private modal: ModalDialogService,
        private itemService: DataService,
        private vcRef: ViewContainerRef, ) { }

    ngOnInit(): void {
        this.items = this.itemService.getPlayers();
    }

    onModalFrame() {
        const options: ModalDialogOptions = {
            context: {
                navigationVisibility: true,
                modalRoute: "modal"
            },
            fullscreen: true,
            viewContainerRef: this.vcRef
        };

        this.modal.showModal(ModalRouterComponent, options).then((res: string) => {
            console.log("moda-frame closed");
        });
    }
}