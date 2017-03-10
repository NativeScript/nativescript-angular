import { Directive, Component, ElementRef, Optional, OnDestroy } from "@angular/core";
import { ActionItem, ActionBar, NavigationButton } from "tns-core-modules/ui/action-bar";
import { isBlank } from "../lang-facade";
import { Page } from "tns-core-modules/ui/page";
import { View } from "tns-core-modules/ui/core/view";
import { registerElement, ViewClassMeta, NgView, TEMPLATE } from "../element-registry";

let actionBarMeta: ViewClassMeta = {
    skipAddToDom: true,
    insertChild: (parent: NgView, child: NgView, _atIndex: number) => {
        const bar = <ActionBar>(<any>parent);
        const childView = <any>child;

        if (child instanceof NavigationButton) {
            bar.navigationButton = childView;
            childView.parent = bar;
        } else if (child instanceof ActionItem) {
            bar.actionItems.addItem(childView);
            childView.parent = bar;
        } else if (child.nodeName === TEMPLATE) {
            child.templateParent = parent;
        } else if (child.nodeName !== "#text" && child instanceof View) {
            bar.titleView = childView;
        }
    },
    removeChild: (parent: NgView, child: NgView) => {
        const bar = <ActionBar>(<any>parent);
        const childView = <any>child;
        if (child instanceof NavigationButton) {
            if (bar.navigationButton === childView) {
                bar.navigationButton = null;
            }
            childView.parent = null;
        } else if (child instanceof ActionItem) {
            bar.actionItems.removeItem(childView);
            childView.parent = null;
        } else if (child.nodeName !== TEMPLATE && child instanceof View &&
            bar.titleView && bar.titleView === childView) {
            bar.titleView = null;
        }
    },
};

registerElement("ActionBar", () => require("ui/action-bar").ActionBar, actionBarMeta);
registerElement("ActionItem", () => require("ui/action-bar").ActionItem);
registerElement("NavigationButton", () => require("ui/action-bar").NavigationButton);

@Component({
    selector: "ActionBar",
    template: "<ng-content></ng-content>"
})
export class ActionBarComponent {
    constructor(public element: ElementRef, private page: Page) {
        if (isBlank(this.page.actionBarHidden)) {
            this.page.actionBarHidden = false;
        }
        this.page.actionBar = this.element.nativeElement;
        this.page.actionBar.update();
    }
}

@Component({
    selector: "ActionBarExtension",
    template: ""
})
export class ActionBarScope { // tslint:disable-line:component-class-suffix
    constructor(private page: Page) {
    }

    public onNavButtonInit(navBtn: NavigationButtonDirective) {
        this.page.actionBar.navigationButton = navBtn.element.nativeElement;
    }

    public onNavButtonDestroy(navBtn: NavigationButtonDirective) {
        const nav = <NavigationButton>navBtn.element.nativeElement;
        if (nav && this.page.actionBar.navigationButton === nav) {
            this.page.actionBar.navigationButton = null;
        }
    }

    public onActionInit(item: ActionItemDirective) {
        this.page.actionBar.actionItems.addItem(item.element.nativeElement);
    }

    public onActionDestroy(item: ActionItemDirective) {
        if (item.element.nativeElement.actionBar) {
            this.page.actionBar.actionItems.removeItem(item.element.nativeElement);
        }
    }
}

@Directive({
    selector: "ActionItem" // tslint:disable-line:directive-selector
})
export class ActionItemDirective implements OnDestroy {
    constructor(public element: ElementRef, @Optional() private ownerScope: ActionBarScope) {
        if (this.ownerScope) {
            this.ownerScope.onActionInit(this);
        }
    }

    ngOnDestroy() {
        if (this.ownerScope) {
            this.ownerScope.onActionDestroy(this);
        }
    }
}

@Directive({
    selector: "NavigationButton" // tslint:disable-line:directive-selector
})
export class NavigationButtonDirective implements OnDestroy {
    constructor(public element: ElementRef, @Optional() private ownerScope: ActionBarScope) {
        if (this.ownerScope) {
            this.ownerScope.onNavButtonInit(this);
        }
    }

    ngOnDestroy() {
        if (this.ownerScope) {
            this.ownerScope.onNavButtonDestroy(this);
        }
    }
}
