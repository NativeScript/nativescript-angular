// make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {Component, ComponentRef, Directive, TemplateRef, ViewContainerRef} from "@angular/core";
import {View} from "tns-core-modules/ui/core/view";
import {Label} from "tns-core-modules/ui/label";
import {nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender} from "nativescript-angular/testing";
// >> third-party-simple-view-registration
import {registerElement} from "nativescript-angular/element-registry";
registerElement("third-party-view", () => require("./third-party-view").SimpleTag);
// << third-party-simple-view-registration

// >> third-party-simple-view-container
@Component({
    selector: "simple-view-container",
    template: `
        <third-party-view prop1="value1"></third-party-view>
    `
})
export class SimpleViewContainer {
}
// << third-party-simple-view-container
//
// >> third-party-document-form-component
@Component({
    selector: "document-form",
    template: ""
})
export class DocumentFormComponent {
    // >> (hide)
    public static titleLabel: Label;
    // << (hide)

    constructor() {
    }

    public setTitleView(view: View) {
        // pass view parameter to native element...
        // >> (hide)
        DocumentFormComponent.titleLabel = <Label>view;
        // << (hide)
    }
}
// << third-party-document-form-component

// >> third-party-template-directive
@Directive({
    selector: "[documentTitle]"
})
export class DocumentTitleDirective {
    public static titleLabel: Label;
    constructor(
        private ownerForm: DocumentFormComponent,
        private viewContainer: ViewContainerRef,
        private template: TemplateRef<any>
    ) {
    }

    ngOnInit() {
        const viewRef = this.viewContainer.createEmbeddedView(this.template);
        // filter out whitespace nodes
        const titleViews = viewRef.rootNodes.filter((node) =>
                            node && node.nodeName !== "#text");

        if (titleViews.length > 0) {
            const titleView = titleViews[0];
            this.ownerForm.setTitleView(titleView);
        }
    }
}
// << third-party-template-directive

// >> third-party-document-form-container
@Component({
    selector: "document-form-container",
    template: `
    <document-form src="document1.pdf">
        <Label *documentTitle text="Document1"></Label>
    </document-form>
    `
})
export class DocumentFormContainer {
}
// << third-party-document-form-container

describe("Third party component snippets", () => {
    before(() => {
        registerElement("document-form", () => require("ui/layouts/stack-layout").StackLayout);
    });

    beforeEach(nsTestBedBeforeEach([
        DocumentFormContainer,
        DocumentFormComponent,
        SimpleViewContainer,
        DocumentTitleDirective
    ]));
    afterEach(nsTestBedAfterEach());

    it("instantiates SimpleView from markup", () => {
        return nsTestBedRender(SimpleViewContainer).then((fixture) => {
            const componentRef: ComponentRef<SimpleViewContainer> = fixture.componentRef;
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, SimpleViewContainer);
        });
    });

    it("renders DocumentForm with title template", () => {
        return nsTestBedRender(DocumentFormContainer).then(() => {
            assert.equal("Document1", DocumentFormComponent.titleLabel.text);
        });
    });
});
