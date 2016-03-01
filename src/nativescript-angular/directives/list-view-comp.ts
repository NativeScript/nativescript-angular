import {
    Component, 
    DoCheck, 
    ElementRef, 
    TemplateRef, 
    ContentChild, 
    AppViewManager,
    EmbeddedViewRef, 
    HostListener, 
    IterableDiffers, 
    IterableDiffer,
    ChangeDetectorRef} from 'angular2/core';
import {Observable as RxObservable} from 'rxjs'
import {ListView} from 'ui/list-view';
import {View} from 'ui/core/view';
import {NgView} from '../view-util';
import {ObservableArray} from 'data/observable-array';
import {LayoutBase} from 'ui/layouts/layout-base';
const NG_VIEW = "_ngViewRef";

@Component({
    selector: 'ListView',
    template: ``,
    inputs: ['items']
})
export class ListViewComponent {
    private listView: ListView;
    private _items: any;
    private _differ: IterableDiffer;
    
    @ContentChild(TemplateRef) itemTemplate: TemplateRef;
    
    set items(value: any) {
        this._items = value;
        var needDiffer = true;
        if (value instanceof ObservableArray) {
            needDiffer = false;
        }
        if (needDiffer && !this._differ && value) {
            this._differ = this._iterableDiffers.find(this._items).create(this._cdr, (index, item) => { return item;});
        }
        this.listView.items = this._items;
    }
    
    private timerId: number;
    private doCheckDelay = 5;
    
    constructor(private _elementRef: ElementRef, 
                private _iterableDiffers: IterableDiffers, 
                private _cdr: ChangeDetectorRef,
                private _appViewManager: AppViewManager) {
        this.listView = _elementRef.nativeElement;
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
            viewRef = this._appViewManager.createEmbeddedViewInContainer(this._elementRef, index, this.itemTemplate);
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
    
    ngDoCheck() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
            
        this.timerId = setTimeout(() => {
            clearTimeout(this.timerId);
            if (this._differ) {
                var changes = this._differ.diff(this._items);
                if (changes) {
                    this.listView.refresh();
                }
            }
        }, this.doCheckDelay);
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
                let parentLayout = actualNodes[0].parent;
                if (parentLayout instanceof LayoutBase) {
                    parentLayout.removeChild(actualNodes[0]);
                }
                return actualNodes[0];
            }
            else {
                return getSingleViewRecursive(actualNodes[0].children, nestLevel + 1)
            }
        }
    }

    return getSingleViewRecursive(viewRef.rootNodes, 0);
}