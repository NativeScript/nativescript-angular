import { Component, NgModule } from "@angular/core";
import { NativeScriptCommonModule, NativeScriptRouterModule, ModalDialogParams } from "@nativescript/angular";
import { Page } from "@nativescript/core";

import { lazyLoadHooksLogProvider } from "./main";
import { SecondComponent } from "./second.component";

const routes = [
    { path: ":id", component: SecondComponent },
];

@Component({
    selector: "modal-lazy-comp",
    template: `<Label text="this is lazily loaded modal component"></Label>`
})
export class ModalLazyComponent {
    constructor(public params: ModalDialogParams, private page: Page) {
        page.on("shownModally", () => {
            const result = this.params.context;
            this.params.closeCallback(result);
        });
    }
}

@NgModule({
    declarations: [
        SecondComponent,
        ModalLazyComponent
    ],
    entryComponents: [ModalLazyComponent], // when lazily loaded and opened via modal on demand
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild(routes)
    ],
    providers: [
        lazyLoadHooksLogProvider
    ]
})
export class SecondModule { }

