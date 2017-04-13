// make sure you import mocha-config before @angular/core
import {assert} from "./test-config";
import {TestApp} from "./test-app";
import {Component, Directive, ElementRef, ViewContainerRef, TemplateRef, Inject} from "@angular/core";
import {View} from "ui/core/view";
import {Label} from "ui/label";

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
    let testApp: TestApp = null;

    before(() => {
        registerElement("document-form", () => require("ui/layouts/stack-layout").StackLayout);

        return TestApp.create([], [
            DocumentFormContainer,
            DocumentFormComponent,
            SimpleViewContainer
        ], [DocumentTitleDirective]).then((app) => {
            testApp = app;
        });
    });

    after(() => {
        testApp.dispose();
    });

    it("instantiates SimpleView from markup", () => {
        return testApp.loadComponent(SimpleViewContainer).then((componentRef) => {
            const componentInstance = componentRef.instance;
            assert.instanceOf(componentInstance, SimpleViewContainer);
        });
    });

    it("renders DocumentForm with title template", () => {
        return testApp.loadComponent(DocumentFormContainer).then((componentRef) => {
            assert.equal("Document1", DocumentFormComponent.titleLabel.text);
        });
    });
});
