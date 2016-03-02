//stash it here before Angular runs it over...
const realAssert = global.assert;
import "reflect-metadata";
import {bootstrap} from "../nativescript-angular/application";
import {
    Type,
    Component,
    ComponentRef,
    DynamicComponentLoader,
    ViewChild,
    ElementRef
} from "angular2/core";
global.assert = realAssert;
import {View} from "ui/core/view";
import {StackLayout} from "ui/layouts/stack-layout";
import {ProxyViewContainer} from "ui/proxy-view-container";
import * as chai from "chai"
declare var assert: typeof chai.assert;
import "./mocha-config";

@Component({
    template: `<StackLayout #loadSite></StackLayout>`
})
export class App {
    @ViewChild("loadSite") public loadSiteRef: ElementRef;

    constructor(public loader: DynamicComponentLoader,
        public elementRef: ElementRef) {
    }
}

@Component({
    template: `<StackLayout><Label text="Layout"></Label></StackLayout>`
})
export class LayoutWithLabel {
    constructor(public elementRef: ElementRef){}
}

@Component({
    selector: "label-cmp",
    template: `<Label text="Layout"></Label>`
})
export class LabelCmp {
    constructor(public elementRef: ElementRef){
    }
}

@Component({
    directives: [LabelCmp],
    template: `<GridLayout><label-cmp></label-cmp></GridLayout>`
})
export class LabelContainer {
    constructor(public elementRef: ElementRef){}
}

@Component({
    selector: "projectable-cmp",
    template: `<StackLayout><ng-content></ng-content></StackLayout>`
})
export class ProjectableCmp {
    constructor(public elementRef: ElementRef){
    }
}
@Component({
    directives: [ProjectableCmp],
    template: `<GridLayout>
        <projectable-cmp><Button text="projected"></Button></projectable-cmp>
    </GridLayout>`
})
export class ProjectionContainer {
    constructor(public elementRef: ElementRef){}
}

describe('bootstrap', () => {
    let appComponent: App = null;
    let _pendingDispose: ComponentRef[] = [];

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
        return bootstrap(App).then((componentRef) => {
            appComponent = componentRef.instance;
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

});

function dumpView(view: View): string {
    let output = ["(", (<any>view).nodeName, " "];
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
