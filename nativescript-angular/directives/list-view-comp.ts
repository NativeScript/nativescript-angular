import {
    Component,
    Directive,
    Input,
    DoCheck,
    OnDestroy,
    AfterContentInit,
    ElementRef,
    ViewContainerRef,
    TemplateRef,
    ContentChild,
    EmbeddedViewRef,
    IterableDiffers,
    IterableDiffer,
    ChangeDetectorRef,
    EventEmitter,
    ViewChild,
    Output,
    Host,
    ChangeDetectionStrategy
} from "@angular/core";
import { isBlank } from "../lang-facade";
import { isListLikeIterable } from "../collection-facade";
import { ListView } from "ui/list-view";
import { View, KeyedTemplate } from "ui/core/view";
import { ObservableArray } from "data/observable-array";
import { LayoutBase } from "ui/layouts/layout-base";
import { listViewLog } from "../trace";

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
    context: ListItemContext;
}

@Component({
    selector: "ListView",
    template: `
        <DetachedContainer>
            <Placeholder #loader></Placeholder>
        </DetachedContainer>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewComponent implements DoCheck, OnDestroy, AfterContentInit {
    public get nativeElement(): ListView {
        return this.listView;
    }

    private listView: ListView;
    private _items: any;
    private _differ: IterableDiffer<KeyedTemplate>;
    private _templateMap: Map<string, KeyedTemplate>;

    @ViewChild("loader", { read: ViewContainerRef }) loader: ViewContainerRef;

    @Output() public setupItemView = new EventEmitter<SetupItemViewArgs>();

    @ContentChild(TemplateRef) itemTemplateQuery: TemplateRef<ListItemContext>;

    itemTemplate: TemplateRef<ListItemContext>;

    @Input()
    get items() {
        return this._items;
    }

    set items(value: any) {
        this._items = value;
        let needDiffer = true;
        if (value instanceof ObservableArray) {
            needDiffer = false;
        }
        if (needDiffer && !this._differ && isListLikeIterable(value)) {
            this._differ = this._iterableDiffers.find(this._items)
                .create(this._cdr, (_index, item) => { return item; });
        }

        this.listView.items = this._items;
    }

    constructor(_elementRef: ElementRef,
        private _iterableDiffers: IterableDiffers,
        private _cdr: ChangeDetectorRef) {
        this.listView = _elementRef.nativeElement;

        this.listView.on("itemLoading", this.onItemLoading, this);
    }

    ngAfterContentInit() {
        listViewLog("ListView.ngAfterContentInit()");
        this.setItemTemplates();
    }

    ngOnDestroy() {
        this.listView.off("itemLoading", this.onItemLoading, this);
    }

    private setItemTemplates() {
        // The itemTemplateQuery may be changed after list items are added that contain <template> inside,
        // so cache and use only the original template to avoid errors.
        this.itemTemplate = this.itemTemplateQuery;

        if (this._templateMap) {
            listViewLog("Setting templates");

            const templates: KeyedTemplate[] = [];
            this._templateMap.forEach(value => {
                templates.push(value);
            });
            this.listView.itemTemplates = templates;
        }
    }

    public registerTemplate(key: string, template: TemplateRef<ListItemContext>) {
        listViewLog("registerTemplate for key: " + key);
        if (!this._templateMap) {
            this._templateMap = new Map<string, KeyedTemplate>();
        }

        const keyedTemplate = {
            key,
            createView: () => {
                listViewLog("registerTemplate for key: " + key);

                const viewRef = this.loader.createEmbeddedView(template, new ListItemContext(), 0);
                const resultView = getSingleViewFromViewRef(viewRef);
                resultView[NG_VIEW] = viewRef;

                return resultView;
            }
        };

        this._templateMap.set(key, keyedTemplate);
    }

    public onItemLoading(args) {
        if (!args.view && !this.itemTemplate) {
            return;
        }

        let index = args.index;
        let items = args.object.items;
        let currentItem = typeof (items.getItem) === "function" ?
            items.getItem(index) : items[index];
        let viewRef: EmbeddedViewRef<ListItemContext>;

        if (args.view) {
            listViewLog("onItemLoading: " + index + " - Reusing existing view");
            viewRef = args.view[NG_VIEW];
            // getting angular view from original element (in cases when ProxyViewContainer
            // is used NativeScript internally wraps it in a StackLayout)
            if (!viewRef) {
                viewRef = (args.view._subViews && args.view._subViews.length > 0) ?
                    args.view._subViews[0][NG_VIEW] : undefined;
            }
        } else {
            listViewLog("onItemLoading: " + index + " - Creating view from template");
            viewRef = this.loader.createEmbeddedView(this.itemTemplate, new ListItemContext(), 0);
            args.view = getSingleViewFromViewRef(viewRef);
            args.view[NG_VIEW] = viewRef;
        }

        this.setupViewRef(viewRef, currentItem, index);

        this.detectChangesOnChild(viewRef, index);
    }

    public setupViewRef(viewRef: EmbeddedViewRef<ListItemContext>, data: any, index: number): void {
        if (isBlank(viewRef)) {
            return;
        }
        const context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 === 0);
        context.odd = !context.even;

        this.setupItemView.next({ view: viewRef, data: data, index: index, context: context });
    }

    private detectChangesOnChild(viewRef: EmbeddedViewRef<ListItemContext>, index: number) {
        // Manually detect changes in child view ref
        // TODO: Is there a better way of getting viewRef"s change detector
        const childChangeDetector = <ChangeDetectorRef>(<any>viewRef);

        listViewLog("Manually detect changes in child: " + index);
        childChangeDetector.markForCheck();
        childChangeDetector.detectChanges();
    }

    ngDoCheck() {
        if (this._differ) {
            listViewLog("ngDoCheck() - execute differ");
            const changes = this._differ.diff(this._items);
            if (changes) {
                listViewLog("ngDoCheck() - refresh");
                this.listView.refresh();
            }
        }
    }
}

function getSingleViewRecursive(nodes: Array<any>, nestLevel: number) {
    const actualNodes = nodes.filter((n) => !!n && n.nodeName !== "#text");

    if (actualNodes.length === 0) {
        throw new Error("No suitable views found in list template! Nesting level: " + nestLevel);
    } else if (actualNodes.length > 1) {
        throw new Error("More than one view found in list template! Nesting level: " + nestLevel);
    } else {
        if (actualNodes[0]) {
            let parentLayout = actualNodes[0].parent;
            if (parentLayout instanceof LayoutBase) {
                parentLayout.removeChild(actualNodes[0]);
            }
            return actualNodes[0];
        } else {
            return getSingleViewRecursive(actualNodes[0].children, nestLevel + 1);
        }
    }
}

function getSingleViewFromViewRef(viewRef: EmbeddedViewRef<any>): View {
    return getSingleViewRecursive(viewRef.rootNodes, 0);
}

@Directive({ selector: "[nsTemplateKey]" })
export class TemplateKeyDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        @Host() private list: ListViewComponent) {
    }

    @Input()
    set nsTemplateKey(value: any) {
        if (this.list && this.templateRef) {
            this.list.registerTemplate(value, this.templateRef);
        }
    }
}
