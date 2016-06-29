import {ElementRef, Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";
import {TabView, TabViewItem} from "ui/tab-view";
import * as utils from '../common/utils';
import {rendererLog, rendererError} from "../trace";
import {isBlank} from '@angular/core/src/facade/lang';

@Directive({
    selector: 'TabView',
    inputs: ['selectedIndex']
})
export class TabViewDirective {
    public tabView: TabView;
    private _selectedIndex: number;
    private viewInitialized: boolean;
    
    get selectedIndex(): number {
        return this._selectedIndex;
    }
    
    set selectedIndex(value) {
        this._selectedIndex = utils.convertToInt(value);
        if (this.viewInitialized) {
            this.tabView.selectedIndex = this._selectedIndex;
        }
    }

    constructor(private element: ElementRef) {
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
    selector: '[tabItem]'
})
export class TabViewItemDirective {
    private item: TabViewItem;

    constructor(
        private owner: TabViewDirective,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) {
    }

    @Input('tabItem') config: any;

    ngOnInit() {
        this.item = new TabViewItem();
        this.item.title = this.config.title;
        
        this.item.iconSource = this.config.iconSource;

        const viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        //Filter out text nodes, etc
        const realViews = viewRef.rootNodes.filter((node) =>
                            node.nodeName && node.nodeName !== '#text')

        if (realViews.length > 0) {
            this.item.view = realViews[0];

            const newItems = (this.owner.tabView.items || []).concat([this.item]);
            this.owner.tabView.items = newItems;
        }
    }
}
