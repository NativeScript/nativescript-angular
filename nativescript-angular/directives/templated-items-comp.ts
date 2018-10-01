import {
    AfterContentInit,
    ContentChild,
    Directive,
    DoCheck,
    ElementRef,
    EmbeddedViewRef,
    EventEmitter,
    Host,
    Inject,
    InjectionToken,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnDestroy,
    Output,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ɵisListLikeIterable as isListLikeIterable
} from "@angular/core";
import { ItemEventData, TemplatedItemsView } from "tns-core-modules/ui/list-view";
import { View, KeyedTemplate } from "tns-core-modules/ui/core/view";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { profile } from "tns-core-modules/profiling";

import { getSingleViewRecursive } from "../element-registry";
import { listViewLog, listViewError, isLogEnabled } from "../trace";

const NG_VIEW = "_ngViewRef";

export class ItemContext {
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
    context: ItemContext;
}

export abstract class TemplatedItemsComponent implements DoCheck, OnDestroy, AfterContentInit {
    public abstract get nativeElement(): TemplatedItemsView;

    protected templatedItemsView: TemplatedItemsView;
    protected _items: any;
    protected _differ: IterableDiffer<KeyedTemplate>;
    protected _templateMap: Map<string, KeyedTemplate>;

    @ViewChild("loader", { read: ViewContainerRef }) loader: ViewContainerRef;

    @Output() public setupItemView = new EventEmitter<SetupItemViewArgs>();

    @ContentChild(TemplateRef) itemTemplateQuery: TemplateRef<ItemContext>;

    itemTemplate: TemplateRef<ItemContext>;

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
                .create((_index, item) => { return item; });
        }

        this.templatedItemsView.items = this._items;
    }

    constructor(_elementRef: ElementRef,
        private _iterableDiffers: IterableDiffers) {
        this.templatedItemsView = _elementRef.nativeElement;

        this.templatedItemsView.on("itemLoading", this.onItemLoading, this);
    }

    ngAfterContentInit() {
        if (isLogEnabled()) {
            listViewLog("TemplatedItemsView.ngAfterContentInit()");
        }

        this.setItemTemplates();
    }

    ngOnDestroy() {
        this.templatedItemsView.off("itemLoading", this.onItemLoading, this);
    }

    private setItemTemplates() {
        // The itemTemplateQuery may be changed after list items are added that contain <template> inside,
        // so cache and use only the original template to avoid errors.
        this.itemTemplate = this.itemTemplateQuery;

        if (this._templateMap) {
            if (isLogEnabled()) {
                listViewLog("Setting templates");
            }

            const templates: KeyedTemplate[] = [];
            this._templateMap.forEach(value => {
                templates.push(value);
            });
            this.templatedItemsView.itemTemplates = templates;
        }
    }

    public registerTemplate(key: string, template: TemplateRef<ItemContext>) {
        if (isLogEnabled()) {
            listViewLog(`registerTemplate for key: ${key}`);
        }

        if (!this._templateMap) {
            this._templateMap = new Map<string, KeyedTemplate>();
        }

        const keyedTemplate = {
            key,
            createView: this.getItemTemplateViewFactory(template)
        };

        this._templateMap.set(key, keyedTemplate);
    }

    @profile
    public onItemLoading(args: ItemEventData) {
        if (!args.view && !this.itemTemplate) {
            return;
        }

        const index = args.index;
        const items = (<any>args.object).items;
        const currentItem = typeof items.getItem === "function" ? items.getItem(index) : items[index];
        let viewRef: EmbeddedViewRef<ItemContext>;

        if (args.view) {
            if (isLogEnabled()) {
                listViewLog(`onItemLoading: ${index} - Reusing existing view`);
            }

            viewRef = args.view[NG_VIEW];
            // Getting angular view from original element (in cases when ProxyViewContainer
            // is used NativeScript internally wraps it in a StackLayout)
            if (!viewRef && args.view instanceof LayoutBase && args.view.getChildrenCount() > 0) {
                viewRef = args.view.getChildAt(0)[NG_VIEW];
            }

            if (!viewRef && isLogEnabled()) {
                listViewError(`ViewReference not found for item ${index}. View recycling is not working`);
            }
        }

        if (!viewRef) {
            if (isLogEnabled()) {
                listViewLog(`onItemLoading: ${index} - Creating view from template`);
            }

            viewRef = this.loader.createEmbeddedView(this.itemTemplate, new ItemContext(), 0);
            args.view = getItemViewRoot(viewRef);
            args.view[NG_VIEW] = viewRef;
        }

        this.setupViewRef(viewRef, currentItem, index);

        this.detectChangesOnChild(viewRef, index);
    }

    public setupViewRef(viewRef: EmbeddedViewRef<ItemContext>, data: any, index: number): void {
        const context = viewRef.context;
        context.$implicit = data;
        context.item = data;
        context.index = index;
        context.even = (index % 2 === 0);
        context.odd = !context.even;

        this.setupItemView.next({ view: viewRef, data: data, index: index, context: context });
    }

    protected getItemTemplateViewFactory(template: TemplateRef<ItemContext>): () => View {
        return () => {
            const viewRef = this.loader.createEmbeddedView(template, new ItemContext(), 0);
            const resultView = getItemViewRoot(viewRef);
            resultView[NG_VIEW] = viewRef;

            return resultView;
        };
    }

    @profile
    private detectChangesOnChild(viewRef: EmbeddedViewRef<ItemContext>, index: number) {
        if (isLogEnabled()) {
            listViewLog(`Manually detect changes in child: ${index}`);
        }

        viewRef.markForCheck();
        viewRef.detectChanges();
    }

    ngDoCheck() {
        if (this._differ) {
            if (isLogEnabled()) {
                listViewLog("ngDoCheck() - execute differ");
            }

            const changes = this._differ.diff(this._items);
            if (changes) {
                if (isLogEnabled()) {
                    listViewLog("ngDoCheck() - refresh");
                }

                this.templatedItemsView.refresh();
            }
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

export const TEMPLATED_ITEMS_COMPONENT = new InjectionToken<TemplatedItemsComponent>("TemplatedItemsComponent");

@Directive({ selector: "[nsTemplateKey]" })
export class TemplateKeyDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        @Inject(TEMPLATED_ITEMS_COMPONENT) @Host() private comp: TemplatedItemsComponent) {
    }

    @Input()
    set nsTemplateKey(value: any) {
        if (this.comp && this.templateRef) {
            this.comp.registerTemplate(value, this.templateRef);
        }
    }
}
