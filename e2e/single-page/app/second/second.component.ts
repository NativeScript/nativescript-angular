import { Component, OnInit, OnDestroy, ViewContainerRef } from "@angular/core";
import { ActivatedRoute, Router, Route } from "@angular/router";

import { ModalDialogService, ModalDialogOptions } from "@nativescript/angular";
import { Page } from "@nativescript/core/ui/page";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RouterExtensions } from "@nativescript/angular/router";
import { ModalComponent } from "./modal/modal.component";

@Component({
    selector: "second",
    template: `
    <ActionBar title="Second Title">
        <ActionItem text="ACTION2"></ActionItem>
    </ActionBar>

    <ActionBarExtension *ngIf="(id$ | async) === 2">
        <ActionItem text="ADD" ios.position="right"></ActionItem>
    </ActionBarExtension>

    <StackLayout>
        <Label [text]="'Second Component: ' + (id$ | async)" class="title"></Label>
        <Button text="Show Modal" (tap)="onShowModal()"></Button>
        <Button text="Back" (tap)="back()"></Button>
    </StackLayout>`
})
export class SecondComponent implements OnInit, OnDestroy {
    public id$: Observable<number>;
    constructor(route: ActivatedRoute,
        private routerExtensions: RouterExtensions,
        private viewContainerRef: ViewContainerRef,
        private modalService: ModalDialogService) {
        this.id$ = route.params.pipe(map(r => +r["id"]));
    }

    ngOnInit() {
        console.log("SecondComponent - ngOnInit()");
    }

    ngOnDestroy() {
        console.log("SecondComponent - ngOnDestroy()");
    }

    back() {
        this.routerExtensions.back();
    }

    onShowModal() {
        let options: ModalDialogOptions = {
            viewContainerRef: this.viewContainerRef,
            context: {
            },
            fullscreen: true
        };

        this.modalService.showModal(ModalComponent, options).then((dialogResult: string) => {
        });
    }
}