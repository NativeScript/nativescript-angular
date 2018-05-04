// make sure you import mocha-config before @angular/core

import { assert } from "./test-config";
import { Component, ComponentRef, ElementRef, NgZone, Renderer2, ViewChild } from "@angular/core";
import { ProxyViewContainer } from "ui/proxy-view-container";
import { Red } from "color/known-colors";
import { dumpView } from "./test-utils";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import { ContentView } from "tns-core-modules/ui/content-view";
import { NgView, registerElement } from "nativescript-angular/element-registry";
import { Button } from "tns-core-modules/ui/button";
import * as view from "tns-core-modules/ui/core/view";
import { isIOS } from "tns-core-modules/platform";
import { View, fontInternalProperty, backgroundInternalProperty } from "tns-core-modules/ui/core/view"
import { nsTestBedAfterEach, nsTestBedBeforeEach, nsTestBedRender } from "nativescript-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Observable, ReplaySubject } from "rxjs";

@Component({
    template: `<StackLayout><Label text="Layout"></Label></StackLayout>`
})
export class ZonedRenderer {
    constructor(public elementRef: ElementRef, public renderer: Renderer2) { }
}

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

export class ButtonCounter extends Button {
    nativeBackgroundRedraws = 0;
    backgroundInternalSetNativeCount = 0;
    fontInternalSetNativeCount = 0;

    [backgroundInternalProperty.setNative](value) {
        this.backgroundInternalSetNativeCount++;
        return super[backgroundInternalProperty.setNative](value);
    }
    [fontInternalProperty.setNative](value) {
        this.fontInternalSetNativeCount++;
        return super[fontInternalProperty.setNative](value);
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

    ready$: Observable<boolean> = new ReplaySubject<boolean>(1);

    ngAfterViewInit() {
        (this.ready$ as ReplaySubject<boolean>).next(true);
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
    beforeEach(nsTestBedBeforeEach([
        LayoutWithLabel, LabelCmp, LabelContainer,
        ProjectableCmp, ProjectionContainer,
        StyledLabelCmp, StyledLabelCmp2,
        NgIfLabel, NgIfThenElseComponent, NgIfMultiple,
        NgIfTwoElements, NgIfMultiple,
        NgIfElseComponent, NgIfThenElseComponent,
        NgForLabel, ZonedRenderer
    ]));
    afterEach(nsTestBedAfterEach(false));

    it("component with a layout", () => {
        return nsTestBedRender(LayoutWithLabel).then((fixture) => {
            const componentRef: ComponentRef<LayoutWithLabel> = fixture.componentRef;
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (StackLayout (Label)))", dumpView(componentRoot));
        });
    });

    it("component without a layout", () => {
        return nsTestBedRender(LabelContainer).then((fixture) => {
            const componentRef: ComponentRef<LabelContainer> = fixture.componentRef;
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (GridLayout (ProxyViewContainer (Label))))", dumpView(componentRoot));
        });
    });

    it("projects content into components", () => {
        return nsTestBedRender(ProjectionContainer).then((fixture) => {
            const componentRef: ComponentRef<ProjectionContainer> = fixture.componentRef;
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal(
                "(ProxyViewContainer (GridLayout (ProxyViewContainer (StackLayout (Button)))))",
                 dumpView(componentRoot));
        });
    });

    it("applies component styles from single source", () => {
        return nsTestBedRender(StyledLabelCmp).then((fixture) => {
            const componentRef: ComponentRef<StyledLabelCmp> = fixture.componentRef;
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            const label = (<ProxyViewContainer>componentRoot).getChildAt(0);
            assert.equal(Red, label.style.color.hex);
        });
    });

    it("applies component styles from multiple sources", () => {
        return nsTestBedRender(StyledLabelCmp2).then((fixture) => {
            const componentRef: ComponentRef<StyledLabelCmp2> = fixture.componentRef;
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

        nsTestBedRender(ZonedRenderer).then((fixture: ComponentFixture<ZonedRenderer>) => {
            fixture.ngZone.run(() => {
                fixture.componentInstance.renderer.listen(view, eventName, callback);
            });

            setTimeout(() => {
                fixture.ngZone.runOutsideAngular(() => {
                    view.notify(eventArg);
                });
            }, 10);
        });

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
        nsTestBedRender(ZonedRenderer).then((fixture: ComponentFixture<ZonedRenderer>) => {
            fixture.ngZone.runOutsideAngular(() => {
                fixture.componentInstance.renderer.listen(view, eventName, callback);

                view.notify(eventArg);
            });
        });
    });

    describe("Structural directives", () => {
        it("ngIf hides component when false", () => {
            return nsTestBedRender(NgIfLabel).then((fixture) => {
                const componentRef: ComponentRef<NgIfLabel> = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal("(ProxyViewContainer)", dumpView(componentRoot));
            });
        });

        it("ngIf show component when true", () => {
            return nsTestBedRender(NgIfLabel).then((fixture) => {
                const componentRef: ComponentRef<NgIfLabel> = fixture.componentRef;
                const component = <NgIfLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                fixture.detectChanges();
                assert.equal("(ProxyViewContainer (Label))", dumpView(componentRoot));
            });
        });

        it("ngIf shows elements in correct order when two are rendered", () => {
            return nsTestBedRender(NgIfTwoElements).then((fixture) => {
                const componentRef: ComponentRef<NgIfTwoElements> = fixture.componentRef;
                const component = <NgIfTwoElements>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                fixture.detectChanges();
                assert.equal(
                    "(ProxyViewContainer (StackLayout (Label), (Button)))",
                    dumpView(componentRoot));
            });
        });

        it("ngIf shows elements in correct order when multiple are rendered and there's *ngIf", () => {
            return nsTestBedRender(NgIfMultiple).then((fixture) => {
                const componentRef: ComponentRef<NgIfMultiple> = fixture.componentRef;
                const component = <NgIfMultiple>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                fixture.detectChanges();
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
            return nsTestBedRender(NgIfElseComponent).then((fixture) => {
                const componentRef: ComponentRef<NgIfElseComponent> = fixture.componentRef;
                const component = <NgIfElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                fixture.detectChanges();

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
            return nsTestBedRender(NgIfElseComponent).then((fixture) => {
                const componentRef: ComponentRef<NgIfElseComponent> = fixture.componentRef;
                const component = <NgIfElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = false;
                fixture.detectChanges();
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
            return nsTestBedRender(NgIfThenElseComponent).then((fixture) => {
                const componentRef: ComponentRef<NgIfThenElseComponent> = fixture.componentRef;
                const component = <NgIfThenElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                fixture.detectChanges();
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
            return nsTestBedRender(NgIfThenElseComponent).then((fixture) => {
                const componentRef: ComponentRef<NgIfThenElseComponent> = fixture.componentRef;
                const component = <NgIfThenElseComponent>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = false;
                fixture.detectChanges();
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
            return nsTestBedRender(NgForLabel).then((fixture) => {
                const componentRef: ComponentRef<NgForLabel> = fixture.componentRef;
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal(
                    "(ProxyViewContainer (Label[text=one]), (Label[text=two]), (Label[text=three]))",
                    dumpView(componentRoot, true));
            });
        });

        it("ngFor updates when item is removed", () => {
            return nsTestBedRender(NgForLabel).then((fixture) => {
                const componentRef: ComponentRef<NgForLabel> = fixture.componentRef;
                const component = <NgForLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.items.splice(1, 1);
                fixture.detectChanges();

                assert.equal(
                    "(ProxyViewContainer (Label[text=one]), (Label[text=three]))",
                    dumpView(componentRoot, true));
            });
        });

        it("ngFor updates when item is inserted", () => {
            return nsTestBedRender(NgForLabel).then((fixture) => {
                const componentRef: ComponentRef<NgForLabel> = fixture.componentRef;
                const component = <NgForLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.items.splice(1, 0, "new");
                fixture.detectChanges();

                assert.equal(
                    "(ProxyViewContainer " +
                    "(Label[text=one]), (Label[text=new]), (Label[text=two]), (Label[text=three]))",
                    dumpView(componentRoot, true));
            });
        });
    });
});

describe("Renderer createElement", () => {
    let renderer: Renderer2 = null;
    beforeEach(nsTestBedBeforeEach([ZonedRenderer]));
    afterEach(nsTestBedAfterEach(false));
    beforeEach(() => {
        return nsTestBedRender(ZonedRenderer).then((fixture: ComponentFixture<ZonedRenderer>) => {
            fixture.ngZone.run(() => {
                renderer = fixture.componentInstance.renderer;
            });
        });
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
    let renderer: Renderer2 = null;
    beforeEach(nsTestBedBeforeEach([ZonedRenderer]));
    afterEach(nsTestBedAfterEach(false));
    beforeEach(() => {
        return nsTestBedRender(ZonedRenderer).then((fixture: ComponentFixture<ZonedRenderer>) => {
            fixture.ngZone.run(() => {
                renderer = fixture.componentInstance.renderer;
            });
        });
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
    let renderer: Renderer2 = null;
    beforeEach(nsTestBedBeforeEach([ZonedRenderer, NgControlSettersCount]));
    afterEach(nsTestBedAfterEach(false));
    beforeEach(() => {
        return nsTestBedRender(ZonedRenderer).then((fixture: ComponentFixture<ZonedRenderer>) => {
            fixture.ngZone.run(() => {
                renderer = fixture.componentInstance.renderer;
            });
        });
    });

    it("view native setters are called once on startup", () => {
        const fixture = TestBed.createComponent(NgControlSettersCount);
        const component: NgControlSettersCount = fixture.componentInstance;
        return component.ready$.subscribe(() => {
            component.buttons.map(btn => btn.nativeElement).forEach(btn => {
                assert.isTrue(btn.isLoaded, `Expected ${btn.id} to be loaded.`);
                assert.isFalse(
                    btn.isLayoutValid,
                    `Expected ${btn.id}'s layout to be invalid because it is uninitialized.`
                );

                assert.equal(
                    btn.backgroundInternalSetNativeCount, 1,
                    `Expected ${btn.id} backgroundInternalSetNativeCount to be called just once.`
                );
                assert.equal(
                    btn.fontInternalSetNativeCount, 1,
                    `Expected ${btn.id} fontInternalSetNativeCount to be called just once.`
                );
                const expectedBackgroundRedraws = isIOS ? 0 : 1;
                assert.equal(
                    btn.nativeBackgroundRedraws, expectedBackgroundRedraws,
                    `Expected ${btn.id} nativeBackgroundRedraws to be called after its layout pass.`
                );
            });
        });
    });
});
