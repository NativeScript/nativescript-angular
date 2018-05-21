import { Directive, Component, ElementRef, Optional, OnDestroy } from "@angular/core";
import {
    ActionBar,
    ActionItem,
    ActionItems,
    NavigationButton,
} from "tns-core-modules/ui/action-bar";
import { Page } from "tns-core-modules/ui/page";

import { isBlank } from "../lang-facade";
import {
    NgView,
    ViewClassMeta,
    ViewExtensions,
    isInvisibleNode,
    isView,
    registerElement,
} from "../element-registry";

export function isActionItem(view: any): view is ActionItem {
    return view instanceof ActionItem;
}

export function isNavigationButton(view: any): view is NavigationButton {
    return view instanceof NavigationButton;
}

type NgActionBar = (ActionBar & ViewExtensions);

const actionBarMeta: ViewClassMeta = {
    skipAddToDom: true,
    insertChild: (parent: NgActionBar, child: NgView, next: any) => {
        if (isInvisibleNode(child)) {
            return;
        } else if (isNavigationButton(child)) {
            parent.navigationButton = child;
            child.parentNode = parent;
        } else if (isActionItem(child)) {
            addActionItem(parent, child, next);
            child.parentNode = parent;
        } else if (isView(child)) {
            parent.titleView = child;
        }
    },
    removeChild: (parent: NgActionBar, child: NgView) => {
        if (isInvisibleNode(child)) {
            return;
        } else if (isNavigationButton(child)) {
            if (parent.navigationButton === child) {
                parent.navigationButton = null;
            }

            child.parentNode = null;
        } else if (isActionItem(child)) {
            parent.actionItems.removeItem(child);
            child.parentNode = null;
        } else if (isView(child) && parent.titleView && parent.titleView === child) {
            parent.titleView = null;
        }
    },
};

const addActionItem = (bar: NgActionBar, item: ActionItem, next: ActionItem) => {
    if (next) {
        insertActionItemBefore(bar, item, next);
    } else {
        appendActionItem(bar, item);
    }
};

const insertActionItemBefore = (bar: NgActionBar, item: ActionItem, next: ActionItem) => {
    const actionItems: ActionItems = bar.actionItems;
    const actionItemsCollection: ActionItem[] = actionItems.getItems();

    const indexToInsert = actionItemsCollection.indexOf(next);
    actionItemsCollection.splice(indexToInsert, 0, item);

    (<any>actionItems).setItems(actionItemsCollection);
};

const appendActionItem = (bar: NgActionBar, item: ActionItem) => {
    bar.actionItems.addItem(item);
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
        if (!this.page) {
            throw new Error("Inside ActionBarComponent but no Page found in DI.");
        }

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
        if (!this.page) {
            throw new Error("Inside ActionBarScope but no Page found in DI.");
        }
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
