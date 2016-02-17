import {HostListener, Host, Directive, Component, ContentChild, EmbeddedViewRef, TemplateRef, ViewContainerRef} from 'angular2/core';
import {View} from 'ui';
import {NgView} from '../view-util'
const NG_VIEW = "_ngViewRef";

var console = {log: function(msg) {}}

@Directive({
    selector: 'ListView',
})
export class ListViewDirective {
    private itemTemplate: ListItemTemplate;
    public registerItemTemplate(container: ListItemTemplate) {
        this.itemTemplate = container;
    }

    @HostListener("itemLoading", ['$event'])
    public onItemLoading(args) {
        if (!this.itemTemplate) {
            return;
        }

        let index = args.index;
        let items = args.object.items;
        let currentItem = typeof (items.getItem) === "function" ? items.getItem(index) : items[index];
        let viewRef: EmbeddedViewRef;

        if (args.view) {
            console.log("ListView.onItemLoading: " + index + " - Reusing exisiting view");
            viewRef = args.view[NG_VIEW];
        }
        else {
            console.log("ListView.onItemLoading: " + index + " - Creating view from template");
            viewRef = this.itemTemplate.instantiateTemplate();
            args.view = getSingleViewFromViewRef(viewRef);
            args.view[NG_VIEW] = viewRef;
        }
        this.setupViewRef(viewRef, currentItem, index);
    }

    public setupViewRef(viewRef: EmbeddedViewRef, data: any, index: number): void {
        viewRef.setLocal('\$implicit', data.item);
        viewRef.setLocal("item", data);
        viewRef.setLocal("index", index);
        viewRef.setLocal('even', (index % 2 == 0));
        viewRef.setLocal('odd', (index % 2 == 1));
    }
}

@Component({
    selector: 'item-template',
    template: ``,
})
export class ListItemTemplate {
    @ContentChild(TemplateRef) template: TemplateRef;

    constructor(
        @Host() listDirective: ListViewDirective,
        private _viewContainer: ViewContainerRef) {

        listDirective.registerItemTemplate(this);
    }

    public instantiateTemplate(): EmbeddedViewRef {
        return this._viewContainer.createEmbeddedView(this.template);
    }
}

function getSingleViewFromViewRef(viewRef: EmbeddedViewRef): View {
    var getSingleViewRecursive = (nodes: Array<any>, nestLevel: number) => {
        var actualNodes = nodes.filter((n) => !!n && n.nodeName !== "#text");

        if (actualNodes.length === 0) {
            throw new Error("No suitable views found in list template! Nesting level: " + nestLevel);
        }
        else if (actualNodes.length > 1) {
            throw new Error("More than one view found in list template! Nesting level: " + nestLevel);
        }
        else {
            if (actualNodes[0]) {
                return actualNodes[0];
            }
            else {
                return getSingleViewRecursive(actualNodes[0].children, nestLevel + 1)
            }
        }
    }

    return getSingleViewRecursive(viewRef.rootNodes, 0);
}