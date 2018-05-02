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
import { TextTransform  } from "tns-core-modules/ui/text-base";

import { InvisibleNode } from "../element-registry";
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
    private _textTransform: TextTransform;

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
    
    
    @Input()
    get textTransform() {
        return this._textTransform;
    }

    set textTransform(value: TextTransform) {
        if (this._textTransform !== value) {
            this._textTransform = value;
            this.ensureItem();
            this.item.textTransform = this._textTransform;
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
            this.item.textTransform = this._textTransform || this.config.textTransform;
        }

        const viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        // Filter out text nodes and comments
        const realViews = viewRef.rootNodes.filter(node =>
                            !(node instanceof InvisibleNode));

        if (realViews.length > 0) {
            this.item.view = realViews[0];

            const newItems = (this.owner.tabView.items || []).concat([this.item]);
            this.owner.tabView.items = newItems;
        }
    }
}
