//make sure you import mocha-config before angular2/core
import {assert} from "./test-config";
import {bootstrap} from "../nativescript-angular/application";
import {
    Type,
    Component,
    ComponentRef,
    DynamicComponentLoader,
    ViewChild,
    ElementRef,
    provide,
    ApplicationRef
} from "angular2/core";
import {View} from "ui/core/view";
import * as background from "ui/styling/background";
import {StackLayout} from "ui/layouts/stack-layout";
import {GridLayout} from "ui/layouts/grid-layout";
import {LayoutBase} from "ui/layouts/layout-base";
import {ProxyViewContainer} from "ui/proxy-view-container";
import {topmost} from 'ui/frame';
import {APP_ROOT_VIEW} from "../nativescript-angular/platform-providers";
import {Red} from "color/known-colors";

@Component({
    selector: 'my-app',
    template: `<StackLayout #loadSite></StackLayout>`
})
export class App {
    @ViewChild("loadSite") public loadSiteRef: ElementRef;

    constructor(public loader: DynamicComponentLoader,
        public elementRef: ElementRef,
        public appRef: ApplicationRef) {
    }
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
    selector: "conditional-label",
    template: `<Label *ngIf="show" text="iffed"></Label>`
})
export class ConditionalLabel {
    public show: boolean = false;
    constructor(public elementRef: ElementRef) {
    }
}


describe('Renderer E2E', () => {
    let appComponent: App = null;
    let _pendingDispose: ComponentRef[] = [];
    let appRef: ApplicationRef = null;

    function loadComponent(type: Type): Promise<ComponentRef> {
        return appComponent.loader.loadIntoLocation(type, appComponent.elementRef, "loadSite").then((componentRef) => {
            _pendingDispose.push(componentRef);
            return componentRef;
        });
    }

    afterEach(() => {
        while (_pendingDispose.length > 0) {
            const componentRef = _pendingDispose.pop()
            componentRef.dispose();
        }
    });

    before(() => {
        //bootstrap the app in a custom location
        const page = topmost().currentPage;
        const rootLayout = <LayoutBase>page.content;
        const viewRoot = new StackLayout();
        rootLayout.addChild(viewRoot);
        GridLayout.setRow(rootLayout, 50);
        const rootViewProvider = provide(APP_ROOT_VIEW, { useFactory: () => viewRoot });
        return bootstrap(App, [rootViewProvider]).then((componentRef) => {
            appComponent = componentRef.instance;
            appRef = appComponent.appRef;
        });
    });

    it("component with a layout", () => {
        return loadComponent(LayoutWithLabel).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (StackLayout (Label)))", dumpView(componentRoot));
        });
    });

    it("component without a layout", () => {
        return loadComponent(LabelContainer).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (GridLayout (ProxyViewContainer (Label))))", dumpView(componentRoot));
        });
    });

    it("projects content into components", () => {
        return loadComponent(ProjectionContainer).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            assert.equal("(ProxyViewContainer (GridLayout (ProxyViewContainer (StackLayout (Button)))))", dumpView(componentRoot));
        });
    });

    it("applies component styles", () => {
        return loadComponent(StyledLabelCmp).then((componentRef) => {
            const componentRoot = componentRef.instance.elementRef.nativeElement;
            const label = (<ProxyViewContainer>componentRoot).getChildAt(0);
            assert.equal(Red, label.style.color.hex);
        });
    });

    describe("Structural directives", () => {
        it("ngIf hides component when false", () => {
            return loadComponent(ConditionalLabel).then((componentRef) => {
                const componentRoot = componentRef.instance.elementRef.nativeElement;
                assert.equal("(ProxyViewContainer (template))", dumpView(componentRoot));
            });
        });

        it("ngIf show component when true", () => {
            return loadComponent(ConditionalLabel).then((componentRef) => {
                const component = <ConditionalLabel>componentRef.instance;
                const componentRoot = component.elementRef.nativeElement;

                component.show = true;
                appRef.tick();
                assert.equal("(ProxyViewContainer (template), (Label))", dumpView(componentRoot));
            });
        })
    })

});

function dumpView(view: View): string {
    let nodeName = (<any>view).nodeName
    if (!nodeName) {
        nodeName = (<any>view.constructor).name + '!';
    }
    let output = ["(", nodeName, " "];
    (<any>view)._eachChildView((child) => {
        const childDump = dumpView(child);
        output.push(childDump);
        output.push(", ");
        return true;
    });
    if (output[output.length - 1] == ", ") {
        output.pop();
    }
    if (output[output.length - 1] == " ") {
        output.pop();
    }
    output.push(")");
    return output.join("");
}
