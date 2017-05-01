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
import { isListLikeIterable } from "../collection-facade";
import { ListView, ItemEventData } from "tns-core-modules/ui/list-view";
import { View, KeyedTemplate } from "tns-core-modules/ui/core/view";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { listViewLog, listViewError } from "../trace";

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
                const resultView = getItemViewRoot(viewRef);
                resultView[NG_VIEW] = viewRef;

                return resultView;
            }
        };

        this._templateMap.set(key, keyedTemplate);
    }

    public onItemLoading(args: ItemEventData) {
        if (!args.view && !this.itemTemplate) {
            return;
        }

        const index = args.index;
        const items = (<any>args.object).items;
        const currentItem = typeof items.getItem === "function" ? items.getItem(index) : items[index];
        let viewRef: EmbeddedViewRef<ListItemContext>;

        if (args.view) {
            listViewLog("onItemLoading: " + index + " - Reusing existing view");
            viewRef = args.view[NG_VIEW];
            // Getting angular view from original element (in cases when ProxyViewContainer
            // is used NativeScript internally wraps it in a StackLayout)
            if (!viewRef && args.view instanceof LayoutBase && args.view.getChildrenCount() > 0) {
                viewRef = args.view.getChildAt(0)[NG_VIEW];
            }

            if (!viewRef) {
                listViewError("ViewReference not found for item " + index + ". View recycling is not working");
            }
        }

        if (!viewRef) {
            listViewLog("onItemLoading: " + index + " - Creating view from template");
            viewRef = this.loader.createEmbeddedView(this.itemTemplate, new ListItemContext(), 0);
            args.view = getItemViewRoot(viewRef);
            args.view[NG_VIEW] = viewRef;
        }

        this.setupViewRef(viewRef, currentItem, index);

        this.detectChangesOnChild(viewRef, index);
    }

    public setupViewRef(viewRef: EmbeddedViewRef<ListItemContext>, data: any, index: number): void {
        const context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 === 0);
        context.odd = !context.even;

        this.setupItemView.next({ view: viewRef, data: data, index: index, context: context });
    }

    private detectChangesOnChild(viewRef: EmbeddedViewRef<ListItemContext>, index: number) {
        listViewLog("Manually detect changes in child: " + index);
        viewRef.markForCheck();
        viewRef.detectChanges();
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

function getSingleViewRecursive(nodes: Array<any>, nestLevel: number): View {
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

export interface ComponentView {
    rootNodes: Array<any>;
    destroy(): void;
}

export type RootLocator = (nodes: Array<any>, nestLevel: number) => View;

export function getItemViewRoot(viewRef: ComponentView, rootLocator: RootLocator = getSingleViewRecursive): View {
    const rootView = rootLocator(viewRef.rootNodes, 0);
    return rootView;
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
