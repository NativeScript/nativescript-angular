//make sure you import mocha-config before angular2/core
import {assert} from "./test-config";
import {Component, ElementRef, Renderer} from "angular2/core";
import {ProxyViewContainer} from "ui/proxy-view-container";
import {Red} from "color/known-colors";
import {dumpView} from "./test-utils";
import {TestApp} from "./test-app";
import {LayoutBase} from "ui/layouts/layout-base";
import {StackLayout} from "ui/layouts/stack-layout";

@Component({
    template: `<StackLayout><Label text="Layout"></Label></StackLayout>`
})
export class LayoutWithLabel {
    constructor(public elementRef: ElementRef) { }
}

@Component({
    selector: "label-cmp",
    template: `<Label text="Layout"></Label>`
})
export class LabelCmp {
    constructor(public elementRef: ElementRef) {
    }
}

@Component({
    directives: [LabelCmp],
    template: `<GridLayout><label-cmp></label-cmp></GridLayout>`
})
export class LabelContainer {
    constructor(public elementRef: ElementRef) { }
}

@Component({
    selector: "projectable-cmp",
    template: `<StackLayout><ng-content></ng-content></StackLayout>`
})
export class ProjectableCmp {
    constructor(public elementRef: ElementRef) {
    }
}
@Component({
    directives: [ProjectableCmp],
    template: `<GridLayout>
        <projectable-cmp><Button text="projected"></Button></projectable-cmp>
    </GridLayout>`
})
export class ProjectionContainer {
    constructor(public elementRef: ElementRef) { }
}

@Component({
    selector: "styled-label-cmp",
    styles: [
        "Label { color: red; }",
    ],
    template: `<Label text="Styled!"></Label>`
})
export class StyledLabelCmp {
    constructor(public elementRef: ElementRef) {
    }
}

@Component({
    selector: "styled-label-cmp2",
    styles: [
        `Label { color: red; }`,
        `
        StackLayout { color: brick; }
        TextField { color: red; background-color: lime; }
        `,
    ],
    template: `
    <StackLayout orientation="horizontal">
        <Label text="Styled!"></Label>
        <TextField text="Styled too!"></TextField>
    </StackLayout>
    `
})
export class StyledLabelCmp2 {
    constructor(public elementRef: ElementRef) {
    }
}

@Component({
    selector: "ng-if-label",
    template: `<Label *ngIf="show" text="iffed"></Label>`
})
export class NgIfLabel {
    public show: boolean = false;
    constructor(public elementRef: ElementRef) {
    }
}

@Component({
    selector: "ng-for-label",
    template: `<Label *ngFor="#item of items" [text]="item"></Label>`
})
export class NgForLabel {
    public items: Array<string> = ["one", "two", "three"];
    constructor(public elementRef: ElementRef) {
    }
}

describe('Renderer E2E', () => {
    let testApp: TestApp = null;

    before(() => {
        return TestApp.create().then((app) => {
            testApp = app;
        })
    });

    after(() => {
        testApp.dispose();
    });

    afterEach(() => {
        testApp.disposeComponents();
    });

    it("component with a layout", () => {
        return testApp.loadComponent(LayoutWithLabel).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (StackLayout (Label)))", dumpView(componentRoot));
        });
    });

    it("component without a layout", () => {
        return testApp.loadComponent(LabelContainer).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (GridLayout (ProxyViewContainer (Label))))", dumpView(componentRoot));
        });
    });

    it("projects content into components", () => {
        return testApp.loadComponent(ProjectionContainer).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (GridLayout (ProxyViewContainer (StackLayout (Button)))))", dumpView(componentRoot));
        });
    });

    it("applies component styles from single source", () => {
        return testApp.loadComponent(StyledLabelCmp).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            const label = (<ProxyViewContainer>componentRoot).getChildAt(0);
            assert.equal(Red, label.style.color.hex);
        });
    });

    it("applies component styles from multiple sources", () => {
        return testApp.loadComponent(StyledLabelCmp2).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            const layout = (<ProxyViewContainer>componentRoot).getChildAt(0);

            const label = (<LayoutBase>layout).getChildAt(0);
            assert.equal(Red, label.style.color.hex);

            const textField = (<LayoutBase>layout).getChildAt(1);
            console.log("TEXT style.color: " + textField.style.color);
            assert.equal(Red, textField.style.color.hex);
        });
    });

    describe("Structural directives", () => {
        it("ngIf hides component when false", () => {
            return testApp.loadComponent(NgIfLabel).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal("(ProxyViewContainer (template))", dumpView(componentRoot));
            });
        });

        it("ngIf show component when true", () => {
            return testApp.loadComponent(NgIfLabel).then((componentRef) => {
                const component = <NgIfLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                testApp.appRef.tick();
                assert.equal("(ProxyViewContainer (template), (Label))", dumpView(componentRoot));
            });
        })

        it("ngFor creates element for each item", () => {
            return testApp.loadComponent(NgForLabel).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal("(ProxyViewContainer (template), (Label[text=one]), (Label[text=two]), (Label[text=three]))", dumpView(componentRoot, true));
            });
        });

        it("ngFor updates when item is removed", () => {
            return testApp.loadComponent(NgForLabel).then((componentRef) => {
                const component = <NgForLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.items.splice(1, 1);
                testApp.appRef.tick();

                assert.equal("(ProxyViewContainer (template), (Label[text=one]), (Label[text=three]))", dumpView(componentRoot, true));
            });
        });

        it("ngFor updates when item is inserted", () => {
            return testApp.loadComponent(NgForLabel).then((componentRef) => {
                const component = <NgForLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.items.splice(1, 0, "new");
                testApp.appRef.tick();

                assert.equal("(ProxyViewContainer (template), (Label[text=one]), (Label[text=new]), (Label[text=two]), (Label[text=three]))", dumpView(componentRoot, true));
            });
        });
    })
})

describe('Renderer createElement', () => {
    let testApp: TestApp = null;
    let renderer: Renderer = null;

    before(() => {
        return TestApp.create().then((app) => {
            testApp = app;
            renderer = testApp.renderer;
        })
    });

    after(() => {
        testApp.dispose();
    });

    it("creates element from CamelCase", () => {
        const result = renderer.createElement(null, "StackLayout", null);
        assert.instanceOf(result, StackLayout, "Renderer should create StackLayout form 'StackLayout'")
    });

    it("creates element from lowercase", () => {
        const result = renderer.createElement(null, "stacklayout", null);
        assert.instanceOf(result, StackLayout, "Renderer should create StackLayout form 'stacklayout'")
    });

    it("creates element from kebab-case", () => {
        const result = renderer.createElement(null, "stack-layout", null);
        assert.instanceOf(result, StackLayout, "Renderer should create StackLayout form 'stack-layout'")
    });

    it("creates ProxyViewContainer for unknownTag", () => {
        const result = renderer.createElement(null, "unknown-tag", null);
        assert.instanceOf(result, ProxyViewContainer, "Renderer should create ProxyViewContainer form 'unknown-tag'")
    });
})