import {ElementRef, Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";
import {TabView, TabViewItem} from "ui/tab-view";

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
    
    set selectedIndex(value: number) {
        this._selectedIndex = value;
        if (this.viewInitialized) {
            this.tabView.selectedIndex = this._selectedIndex;
        }
    }

    constructor(private element: ElementRef) {
        this.tabView = element.nativeElement;
    }
    
    ngAfterViewInit() {
        this.viewInitialized = true;
        this.tabView.selectedIndex = this._selectedIndex;
    }
}

@Directive({
    selector: '[tabItem]'
})
export class TabViewItemDirective {
    private item: TabViewItem;

    constructor(
        private owner: TabViewDirective,
        private templateRef: TemplateRef,
        private viewContainer: ViewContainerRef
    ) {
    }

    @Input('tabItem') config: any;

    ngOnInit() {
        this.item = new TabViewItem();
        this.item.title = this.config.title;

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
