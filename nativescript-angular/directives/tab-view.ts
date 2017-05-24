import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef,
} from "@angular/core";
import { TabView, TabViewItem } from "tns-core-modules/ui/tab-view";

import { CommentNode } from "../element-types";
import { convertToInt } from "../common/utils";
import { rendererLog } from "../trace";
import { isBlank } from "../lang-facade";

@Directive({
    selector: "TabView", // tslint:disable-line:directive-selector
})
export class TabViewDirective implements AfterViewInit {
    public tabView: TabView;
    private _selectedIndex: number;
    private viewInitialized: boolean;

    @Input()
    get selectedIndex(): number {
        return this._selectedIndex;
    }

    set selectedIndex(value) {
        this._selectedIndex = convertToInt(value);
        if (this.viewInitialized) {
            this.tabView.selectedIndex = this._selectedIndex;
        }
    }

    constructor(element: ElementRef) {
        this.tabView = element.nativeElement;
    }

    ngAfterViewInit() {
        this.viewInitialized = true;
        rendererLog("this._selectedIndex: " + this._selectedIndex);
        if (!isBlank(this._selectedIndex)) {
            this.tabView.selectedIndex = this._selectedIndex;
        }
    }
}

@Directive({
    selector: "[tabItem]" // tslint:disable-line:directive-selector
})
export class TabViewItemDirective implements OnInit {
    private item: TabViewItem;
    private _title: string;
    private _iconSource: string;

    constructor(
        private owner: TabViewDirective,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
    }

    @Input("tabItem") config: any; // tslint:disable-line:no-input-rename

    @Input()
    get title() {
        return this._title;
    }

    set title(value: string) {
        if (this._title !== value) {
            this._title = value;
            this.ensureItem();
            this.item.title = this._title;
        }
    }

    @Input()
    get iconSource() {
        return this._iconSource;
    }

    set iconSource(value: string) {
        if (this._iconSource !== value) {
            this._iconSource = value;
            this.ensureItem();
            this.item.iconSource = this._iconSource;
        }
    }

    private ensureItem() {
        if (!this.item) {
            this.item = new TabViewItem();
        }
    }

    ngOnInit() {
        this.ensureItem();
        if (this.config) {
            this.item.title = this._title || this.config.title;
            this.item.iconSource = this._iconSource || this.config.iconSource;
        }

        const viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        // Filter out text nodes and comments
        const realViews = viewRef.rootNodes.filter(node =>
                            !(node instanceof CommentNode));

        if (realViews.length > 0) {
            this.item.view = realViews[0];

            const newItems = (this.owner.tabView.items || []).concat([this.item]);
            this.owner.tabView.items = newItems;
        }
    }
}
