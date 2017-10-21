// make sure you import mocha-config before @angular/core
import { assert } from "./test-config";
import { Component, ElementRef, Renderer2, NgZone, ViewChild } from "@angular/core";
import { ProxyViewContainer } from "ui/proxy-view-container";
import { Red } from "color/known-colors";
import { dumpView } from "./test-utils";
import { TestApp } from "./test-app";
import { LayoutBase } from "ui/layouts/layout-base";
import { StackLayout } from "ui/layouts/stack-layout";
import { ContentView } from "ui/content-view";
import { Button } from "ui/button";
import { NgView } from "nativescript-angular/element-registry";
import { registerElement } from "nativescript-angular/element-registry";
import * as button from "tns-core-modules/ui/button";
import * as view from "tns-core-modules/ui/core/view";

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
    selector: "ng-if-two-elements",
    template: `
        <StackLayout>
            <Label *ngIf="show" text="label"></Label>
            <Button text="button"></Button>
        </StackLayout>
    `
})
export class NgIfTwoElements {
    public show: boolean = false;
    constructor(public elementRef: ElementRef) {
    }
}

@Component({
    selector: "ng-if-multiple",
    template: `
        <StackLayout>
            <Label text="1"></Label>
            <Label text="2"></Label>
            <Label text="3"></Label>
            <Label *ngIf="true" text="4"></Label>
            <Label text="5"></Label>
        </StackLayout>
    `
})
export class NgIfMultiple {
    public show: boolean = false;
    constructor(public elementRef: ElementRef) {
    }
}

@Component({
    selector: "ng-if-else",
    template: `
        <StackLayout>
            <Label *ngIf="show; else elseClause" text="If"></Label>

            <ng-template #elseClause>
                <Label text="Else"></Label>
            </ng-template>
        </StackLayout>
    `
})
export class NgIfElseComponent {
    public show: boolean = true;
    constructor(public elementRef: ElementRef) {
    }
}


@Component({
    selector: "ng-if-then-else",
    template: `
        <StackLayout>
            <Placeholder *ngIf="show; then thenTemplate else elseTemplate">
            </Placeholder>

            <ng-template #thenTemplate>
                <Label text="Then"></Label>
            </ng-template>

            <ng-template #elseTemplate>
                <Label text="Else"></Label>
            </ng-template>
        </StackLayout>
    `
})
export class NgIfThenElseComponent {
    public show: boolean = true;
    constructor(public elementRef: ElementRef) {
    }
}

export class ButtonCounter extends button.Button {
    nativeBackgroundRedraws = 0;
    backgroundInternalSetNativeCount = 0;
    fontInternalSetNativeCount = 0;

    [view.backgroundInternalProperty.setNative](value) {
        this.backgroundInternalSetNativeCount++;
        return super[view.backgroundInternalProperty.setNative](value);
    }
    [view.fontInternalProperty.setNative](value) {
        this.fontInternalSetNativeCount++;
        return super[view.fontInternalProperty.setNative](value);
    }
    _redrawNativeBackground(value: any): void {
        this.nativeBackgroundRedraws++;
        super["_redrawNativeBackground"](value);
    }
}
registerElement("ButtonCounter", () => ButtonCounter);

@Component({
    selector: "ng-control-setters-count",
    template: `
        <StackLayout>
            <ButtonCounter #btn1 id="btn1" borderWidth="1" borderColor="gray" borderRadius="16" fontWeight="bold" fontSize="16"></ButtonCounter>
            <ButtonCounter #btn2 id="btn2"></ButtonCounter>
            <ButtonCounter #btn3 id="btn3" borderWidth="1" borderColor="gray" borderRadius="16" fontWeight="bold" fontSize="16"></ButtonCounter>
            <ButtonCounter #btn4 id="btn4" borderRadius="3" style="background-image: url('~/logo.png'); background-position: center; background-repeat: no-repeat; background-size: cover;"></ButtonCounter>
        </StackLayout>
    `,
    styles: [`
        #btn2, #btn3, #btn4 {
            border-width: 2;
            border-color: teal;
            border-radius: 20;
            font-weight: 400;
            font-size: 32;
        }`]
})
export class NgControlSettersCount {
    @ViewChild("btn1") btn1: ElementRef;
    @ViewChild("btn2") btn2: ElementRef;
    @ViewChild("btn3") btn3: ElementRef;
    @ViewChild("btn3") btn4: ElementRef;

    get buttons(): ElementRef[] { return [this.btn1, this.btn2, this.btn3, this.btn4]; }

    isAfterViewInit: boolean = false;

    ngAfterViewInit() {
        this.isAfterViewInit = true;
    }
}

@Component({
    selector: "ng-for-label",
    template: `<Label *ngFor="let item of items" [text]="item"></Label>`
})
export class NgForLabel {
    public items: Array<string> = ["one", "two", "three"];
    constructor(public elementRef: ElementRef) {
    }
}

describe("Renderer E2E", () => {
    let testApp: TestApp = null;

    before(() => {
        return TestApp.create([], [
            LayoutWithLabel, LabelCmp, LabelContainer,
            ProjectableCmp, ProjectionContainer,
            StyledLabelCmp, StyledLabelCmp2,
            NgIfLabel, NgIfThenElseComponent, NgIfMultiple,
            NgIfTwoElements, NgIfMultiple,
            NgIfElseComponent, NgIfThenElseComponent,
            NgForLabel,
        ]).then((app) => {
            testApp = app;
        });
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
            assert.equal(
                "(ProxyViewContainer (GridLayout (ProxyViewContainer (StackLayout (Button)))))",
                 dumpView(componentRoot));
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

    it("executes events inside NgZone when listen is called inside NgZone", (done) => {
        const eventName = "someEvent";
        const view = new StackLayout();
        const eventArg = { eventName, object: view };
        const callback = (arg) => {
            assert.equal(arg, eventArg);
            assert.isTrue(NgZone.isInAngularZone(), "Event should be executed inside NgZone");
            done();
        };

        testApp.zone.run(() => {
            testApp.renderer.listen(view, eventName, callback);
        });

        setTimeout(() => {
            testApp.zone.runOutsideAngular(() => {
                view.notify(eventArg);
            });
        }, 10);
    });

    it("executes events inside NgZone when listen is called outside NgZone", (done) => {
        const eventName = "someEvent";
        const view = new StackLayout();
        const eventArg = { eventName, object: view };
        const callback = (arg) => {
            assert.equal(arg, eventArg);
            assert.isTrue(NgZone.isInAngularZone(), "Event should be executed inside NgZone");
            done();
        };

        testApp.zone.runOutsideAngular(() => {
            testApp.renderer.listen(view, eventName, callback);

            view.notify(eventArg);
        });
    });

    describe("Structural directives", () => {
        it("ngIf hides component when false", () => {
            return testApp.loadComponent(NgIfLabel).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal("(ProxyViewContainer)", dumpView(componentRoot));
            });
        });

        it("ngIf show component when true", () => {
            return testApp.loadComponent(NgIfLabel).then((componentRef) => {
                const component = <NgIfLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                testApp.appRef.tick();
                assert.equal("(ProxyViewContainer (Label))", dumpView(componentRoot));
            });
        });

        it("ngIf shows elements in correct order when two are rendered", () => {
            return testApp.loadComponent(NgIfTwoElements).then((componentRef) => {
                const component = <NgIfTwoElements>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                testApp.appRef.tick();
                assert.equal(
                    "(ProxyViewContainer (StackLayout (Label), (Button)))",
                    dumpView(componentRoot));
            });
        });

        it("ngIf shows elements in correct order when multiple are rendered and there's *ngIf", () => {
            return testApp.loadComponent(NgIfMultiple).then((componentRef) => {
                const component = <NgIfMultiple>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                testApp.appRef.tick();
                assert.equal(
                    "(ProxyViewContainer " +
                        "(StackLayout " +
                            "(Label[text=1]), " +
                            "(Label[text=2]), " +
                            "(Label[text=3]), " +
                            "(Label[text=4]), " + // the content to be conditionally displayed
                            "(Label[text=5])" +
                        ")" +
                    ")",
                    dumpView(componentRoot, true));
            });
        });

        it("ngIfElse show 'if' template when condition is true", () => {
            return testApp.loadComponent(NgIfElseComponent).then(componentRef => {
                const component = <NgIfElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                testApp.appRef.tick();

                assert.equal(
                    "(ProxyViewContainer " +
                        "(StackLayout " +
                            "(Label[text=If])" +
                        ")" +
                    ")",

                    dumpView(componentRoot, true));
            });
        });

        it("ngIfElse show 'else' template when condition is false", () => {
            return testApp.loadComponent(NgIfElseComponent).then(componentRef => {
                const component = <NgIfElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = false;
                testApp.appRef.tick();
                assert.equal(
                    "(ProxyViewContainer " +
                        "(StackLayout " +
                            "(Label[text=Else])" +
                        ")" +
                    ")",

                    dumpView(componentRoot, true));
            });
        });

        it("ngIfThenElse show 'then' template when condition is true", () => {
            return testApp.loadComponent(NgIfThenElseComponent).then(componentRef => {
                const component = <NgIfThenElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                testApp.appRef.tick();
                assert.equal(
                    "(ProxyViewContainer " +
                        "(StackLayout " +
                            "(Label[text=Then])" +
                        ")" +
                    ")",

                    dumpView(componentRoot, true));
            });
        });


        it("ngIfThenElse show 'else' template when condition is false", () => {
            return testApp.loadComponent(NgIfThenElseComponent).then(componentRef => {
                const component = <NgIfThenElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = false;
                testApp.appRef.tick();
                assert.equal(
                    "(ProxyViewContainer " +
                        "(StackLayout " +
                            "(Label[text=Else])" +
                        ")" +
                    ")",

                    dumpView(componentRoot, true));
            });
        });

        it("ngFor creates element for each item", () => {
            return testApp.loadComponent(NgForLabel).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (Label[text=one]), (Label[text=two]), (Label[text=three]))",
                    dumpView(componentRoot, true));
            });
        });

        it("ngFor updates when item is removed", () => {
            return testApp.loadComponent(NgForLabel).then((componentRef) => {
                const component = <NgForLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.items.splice(1, 1);
                testApp.appRef.tick();

                assert.equal(
                    "(ProxyViewContainer (Label[text=one]), (Label[text=three]))",
                    dumpView(componentRoot, true));
            });
        });

        it("ngFor updates when item is inserted", () => {
            return testApp.loadComponent(NgForLabel).then((componentRef) => {
                const component = <NgForLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.items.splice(1, 0, "new");
                testApp.appRef.tick();

                assert.equal(
                    "(ProxyViewContainer " +
                    "(Label[text=one]), (Label[text=new]), (Label[text=two]), (Label[text=three]))",
                    dumpView(componentRoot, true));
            });
        });
    });
});

describe("Renderer createElement", () => {
    let testApp: TestApp = null;
    let renderer: Renderer2 = null;

    before(() => {
        return TestApp.create().then((app) => {
            testApp = app;
            renderer = testApp.renderer;
        });
    });

    after(() => {
        testApp.dispose();
    });

    it("creates element from CamelCase", () => {
        const result = renderer.createElement("StackLayout");
        assert.instanceOf(result, StackLayout, "Renderer should create StackLayout form 'StackLayout'");
    });

    it("creates element from lowercase", () => {
        const result = renderer.createElement("stacklayout");
        assert.instanceOf(result, StackLayout, "Renderer should create StackLayout form 'stacklayout'");
    });

    it("creates element from kebab-case", () => {
        const result = renderer.createElement("stack-layout");
        assert.instanceOf(result, StackLayout, "Renderer should create StackLayout form 'stack-layout'");
    });

    it("creates ProxyViewContainer for unknownTag", () => {
        const result = renderer.createElement("unknown-tag");
        assert.instanceOf(result, ProxyViewContainer, "Renderer should create ProxyViewContainer form 'unknown-tag'");
    });
});

describe("Renderer attach/detach", () => {
    let testApp: TestApp = null;
    let renderer: Renderer2 = null;

    before(() => {
        return TestApp.create().then((app) => {
            testApp = app;
            renderer = testApp.renderer;
        });
    });

    after(() => {
        testApp.dispose();
    });

    it("createElement element with parent attaches element to content view", () => {
        const parent = <ContentView>renderer.createElement("ContentView");
        const button = <Button>renderer.createElement("Button");
        renderer.appendChild(parent, button);

        assert.equal(parent.content, button);
        assert.equal(button.parent, parent);
    });

    it("createElement element with parent attaches element to layout view", () => {
        const parent = <StackLayout>renderer.createElement("StackLayout");
        const button = <Button>renderer.createElement("Button");
        renderer.appendChild(parent, button);

        assert.equal(parent.getChildAt(0), button);
        assert.equal(button.parent, parent);
    });

    it("detachView element removes element from content view", () => {
        const parent = <ContentView>renderer.createElement("ContentView");
        const button = <Button>renderer.createElement("Button");
        renderer.appendChild(parent, button);

        renderer.removeChild(parent, button);

        assert.isNull(parent.content);
        assert.isUndefined(button.parent);
    });

    it("detachView element removes element from layout view", () => {
        const parent = <StackLayout>renderer.createElement("StackLayout");
        const button = <Button>renderer.createElement("Button");
        renderer.appendChild(parent, button);

        renderer.removeChild(parent, button);

        assert.equal(parent.getChildrenCount(), 0);
        assert.isUndefined(button.parent);
    });
});

describe("Renderer lifecycle", () => {
    let testApp: TestApp = null;
    let renderer: Renderer2 = null;

    before(() => {
        return TestApp.create([], [NgControlSettersCount]).then((app) => {
            testApp = app;
            renderer = testApp.renderer;
        });
    });

    after(() => {
        testApp.dispose();
    });

    afterEach(() => {
        testApp.disposeComponents();
    });

    it("view native setters are called once on startup", () => {
        return testApp.loadComponent(NgControlSettersCount).then((componentRef) => {
            assert.isTrue(componentRef.instance.isAfterViewInit, "Expected the NgControlSettersCount to have passed its ngAfterViewInit.");
            componentRef.instance.buttons.map(btn => btn.nativeElement).forEach(btn => {
                assert.isTrue(btn.isLoaded, `Expected ${btn.id} to be allready loaded.`);
                assert.isFalse(btn.isLayoutValid, `Expected ${btn.id}'s layout to be invalid.`);

                assert.equal(btn.backgroundInternalSetNativeCount, 1, `Expected ${btn.id} backgroundInternalSetNativeCount to be called just once.`);
                assert.equal(btn.fontInternalSetNativeCount, 1, `Expected ${btn.id} fontInternalSetNativeCount to be called just once.`);
                assert.equal(btn.nativeBackgroundRedraws, 0, `Expected ${btn.id} nativeBackgroundRedraws to be called after its layout pass.`);
            });
        });
    });
});
