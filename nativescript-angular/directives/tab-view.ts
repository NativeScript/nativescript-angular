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
import { TextTransform, Color } from "tns-core-modules/ui/text-base";

import { InvisibleNode } from "../element-registry";
import { rendererLog, isLogEnabled } from "../trace";
import { isBlank } from "../lang-facade";

export interface TabViewItemDef {
    title?: string;
    iconSource?: string;
    textTransform?: TextTransform;
}

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
        this._selectedIndex = value;
        if (this.viewInitialized) {
            this.tabView.selectedIndex = this._selectedIndex;
        }
    }

    constructor(element: ElementRef) {
        this.tabView = element.nativeElement;
    }

    ngAfterViewInit() {
        this.viewInitialized = true;
        if (isLogEnabled()) {
            rendererLog("this._selectedIndex: " + this._selectedIndex);
        }
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
    private _config: TabViewItemDef;

    constructor(
        private owner: TabViewDirective,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
    }

    @Input("tabItem")
    set config(config: TabViewItemDef) {
        if (!this._config
            || this._config.iconSource !== config.iconSource
            || this._config.title !== config.title
            || this._config.textTransform !== config.textTransform) {
            this._config = config;
            this.applyConfig();
        }
    }

    get config(): TabViewItemDef { // tslint:disable-line:no-input-rename
        return this._config || {};
    }

    @Input()
    set title(title: string) {
        this.config = Object.assign(this.config, { title });
    }

    get title() {
        return this.config.title;
    }

    @Input()
    set iconSource(iconSource: string) {
        this.config = Object.assign(this.config, { iconSource });
    }

    get iconSource() {
        return this.config.iconSource;
    }

    @Input()
    set textTransform(textTransform: TextTransform) {
        this.config = Object.assign(this.config, { textTransform });
    }

    get textTransform() {
        return this.config.textTransform;
    }

    private ensureItem() {
        if (!this.item) {
            this.item = new TabViewItem();
        }
    }

    private applyConfig() {
        this.ensureItem();

        if (this.config.title) {
            this.item.title = this.config.title;
        }

        if (this.config.iconSource) {
            this.item.iconSource = this.config.iconSource;
        }

        //  TabViewItem textTransform has a default value for Android that kick in
        // only if no value (even a null value) is set.
        if (this.config.textTransform) {
            this.item.textTransform = this.config.textTransform;
        }
    }

    ngOnInit() {
        this.applyConfig();

        const viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        // Filter out text nodes and comments
        const realViews = viewRef.rootNodes.filter(node =>
                            !(node instanceof InvisibleNode));

        if (realViews.length > 0) {
            this.item.view = realViews[0];
            // prevent white flash on tab changes
            this.item.view.backgroundColor = new Color('#00000000');
            const newItems = (this.owner.tabView.items || []).concat([this.item]);
            this.owner.tabView.items = newItems;
        }
    }
}
