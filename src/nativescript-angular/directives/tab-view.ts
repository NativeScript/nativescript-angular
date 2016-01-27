import {ElementRef, Directive, Input, TemplateRef, ViewContainerRef} from "angular2/core";
import {TabView, TabViewItem} from "ui/tab-view";
import {isView} from "../view-util";

@Directive({
    selector: 'TabView'
})
export class TabViewDirective {
    public tabView: TabView;

    constructor(private element: ElementRef) {
        this.tabView = element.nativeElement;
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
