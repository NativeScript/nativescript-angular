import {
    Component,
    DoCheck,
    OnDestroy,
    ElementRef,
    ViewContainerRef,
    TemplateRef,
    ContentChild,
    EmbeddedViewRef,
    HostListener,
    IterableDiffers,
    IterableDiffer,
    ChangeDetectorRef,
    EventEmitter,
    ViewChild,
    Output,
    NgZone,
    ChangeDetectionStrategy } from '@angular/core';
import {isBlank} from '@angular/core/src/facade/lang';
import {isListLikeIterable} from '@angular/core/src/facade/collection';
import {Observable as RxObservable} from 'rxjs'
import {ListView} from 'ui/list-view';
import {View} from 'ui/core/view';
import {NgView} from '../view-util';
import {ObservableArray} from 'data/observable-array';
import {LayoutBase} from 'ui/layouts/layout-base';
<<<<<<< 2b36449d70d559d1fda6cdf4d271246b5fe0ecd2
import {rendererLog, rendererError} from "../trace";
=======
import 'rxjs/add/operator/debounceTime';

>>>>>>> Manually trigger change detection onItemLoading for current item only
const NG_VIEW = "_ngViewRef";

export class ListItemContext {
    constructor(
        public $implicit?: any,
        public item?: any,
        public index?: number,
        public even?: boolean,
        public odd?: boolean
    ) {
    }
}

export interface SetupItemViewArgs {
    view: EmbeddedViewRef<any>;
    data: any;
    index: number;
}

@Component({
    selector: 'ListView',
    template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>`,
    inputs: ['items'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewComponent implements DoCheck, OnDestroy {
    public get nativeElement(): ListView {
        return this.listView;
    }

    private listView: ListView;
    private _items: any;
    private _differ: IterableDiffer;

    @ViewChild('loader', { read: ViewContainerRef }) loader: ViewContainerRef;

    @Output() public setupItemView: EventEmitter<SetupItemViewArgs> = new EventEmitter<SetupItemViewArgs>();

    @ContentChild(TemplateRef) itemTemplate: TemplateRef<ListItemContext>;

    set items(value: any) {
        this._items = value;
        var needDiffer = true;
        if (value instanceof ObservableArray) {
            needDiffer = false;
        }
        if (needDiffer && !this._differ && isListLikeIterable(value)) {
            this._differ = this._iterableDiffers.find(this._items).create(this._cdr, (index, item) => { return item; });
        }

        // this._cdr.detach();
        this.listView.items = this._items;
    }

    constructor(private _elementRef: ElementRef,
        private _iterableDiffers: IterableDiffers,
        private _cdr: ChangeDetectorRef,
        private _zone: NgZone) {
        this.listView = _elementRef.nativeElement;

        this.listView.on("itemLoading", this.onItemLoading, this);
    }

    ngOnDestroy() {
        this.listView.off("itemLoading", this.onItemLoading, this);
    }

    public onItemLoading(args) {
        if (!this.itemTemplate) {
            return;
        }

        let index = args.index;
        let items = args.object.items;
        let currentItem = typeof (items.getItem) === "function" ? items.getItem(index) : items[index];
        let viewRef: EmbeddedViewRef<ListItemContext>;

        if (args.view) {
            log("ListView.onItemLoading: " + index + " - Reusing existing view");

            viewRef = args.view[NG_VIEW];
            // getting angular view from original element (in cases when ProxyViewContainer is used NativeScript internally wraps it in a StackLayout)
            if (!viewRef) {
                viewRef = (args.view._subViews && args.view._subViews.length > 0) ? args.view._subViews[0][NG_VIEW] : undefined;
            }
        }
        else {
            log("ListView.onItemLoading: " + index + " - Creating view from template");
            viewRef = this.loader.createEmbeddedView(this.itemTemplate, new ListItemContext(), 0);
            args.view = getSingleViewFromViewRef(viewRef);
            args.view[NG_VIEW] = viewRef;
        }
        this.setupViewRef(viewRef, currentItem, index);

        this.detectChangesOnChild(viewRef);
    }

    public setupViewRef(viewRef: EmbeddedViewRef<ListItemContext>, data: any, index: number): void {
        if (isBlank(viewRef)) {
            return;
        }
        const context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 == 0);
        context.odd = !context.even;

        this.setupItemView.next({ view: viewRef, data: data, index: index, context: context });
    }

    private detectChangesOnChild(viewRef: EmbeddedViewRef<ListItemContext>){
        // Manually detect changes in view ref
        var childCD = <ChangeDetectorRef>(<any>viewRef);
        var childView = (<any>viewRef)._view;

        log("------------ detectChanges START ----------")
        log("CangeDetectionState child before mark " + this.logCD(childView));
        childCD.markForCheck();
        childCD.detectChanges();
        log("CangeDetectionState child after detect " + this.logCD(childView));
        log("------------ detectChanges END ----------")
    }

    private logCD(cdr: any) {
        var modes = ["CheckOnce", "Checked", "CheckAlways", "Detached", "OnPush", "Default"];
        var states = ["Never", "CheckedBefore", "Error"];
        return "Mode: " + modes[parseInt(cdr.cdMode)] + " State: " + states[parseInt(cdr.cdState)];
    }

    ngDoCheck() {
        if (this._differ) {
            log("======> ngDoCheck() DIFFER")
            var changes = this._differ.diff(this._items);
            if (changes) {
                log("======> ngDoCheck() REFRESH")
                // this._cdr.detach();
                this.listView.refresh();
            }
        }
    }
}

function log(msg){
    // console.log(msg);
}

function getSingleViewFromViewRef(viewRef: EmbeddedViewRef<any>): View {
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
