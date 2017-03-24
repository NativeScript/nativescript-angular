import { View } from "ui/core/view";

export type ViewResolver = () => ViewClass;
export type NgView = View & ViewExtensions;
export interface ViewClassMeta {
    skipAddToDom?: boolean;
    insertChild?: (parent: NgView, child: NgView, atIndex: number) => void;
    removeChild?: (parent: NgView, child: NgView) => void;
}

export interface ViewExtensions {
    nodeName: string;
    templateParent: NgView;
    ngCssClasses: Map<string, boolean>;
    meta: ViewClassMeta;
}

export interface ViewClass {
    new (): View;
}

const defaultViewMeta: ViewClassMeta = {
    skipAddToDom: false,
};

const elementMap = new Map<string, { resolver: ViewResolver, meta?: ViewClassMeta }>();
const camelCaseSplit = /([a-z0-9])([A-Z])/g;

export function registerElement(
    elementName: string,
    resolver: ViewResolver,
    meta?: ViewClassMeta
): void {
    if (elementMap.has(elementName)) {
        throw new Error(`Element for ${elementName} already registered.`);
    } else {
        const entry = { resolver: resolver, meta: meta };
        elementMap.set(elementName, entry);
        elementMap.set(elementName.toLowerCase(), entry);
        elementMap.set(elementName.replace(camelCaseSplit, "$1-$2").toLowerCase(), entry);
    }
}

export function getViewClass(elementName: string): ViewClass {
    const entry = elementMap.get(elementName) ||
        elementMap.get(elementName.toLowerCase());
    if (!entry) {
        throw new TypeError(`No known component for element ${elementName}.`);
    }
    try {
        return entry.resolver();
    } catch (e) {
        throw new TypeError(`Could not load view for: ${elementName}.${e}`);
    }
}

export function getViewMeta(nodeName: string): ViewClassMeta {
    let meta = defaultViewMeta;
    const entry = elementMap.get(nodeName) || elementMap.get(nodeName.toLowerCase());
    if (entry && entry.meta) {
        meta = entry.meta;
    }
    return meta;
}

export function isKnownView(elementName: string): boolean {
    return elementMap.has(elementName) ||
        elementMap.has(elementName.toLowerCase());
}

// Register default NativeScript components
// Note: ActionBar related components are registerd together with action-bar directives.
registerElement("AbsoluteLayout", () => require("ui/layouts/absolute-layout").AbsoluteLayout);
registerElement("ActivityIndicator", () => require("ui/activity-indicator").ActivityIndicator);
registerElement("Border", () => require("ui/border").Border);
registerElement("Button", () => require("ui/button").Button);
registerElement("ContentView", () => require("ui/content-view").ContentView);
registerElement("DatePicker", () => require("ui/date-picker").DatePicker);
registerElement("DockLayout", () => require("ui/layouts/dock-layout").DockLayout);
registerElement("GridLayout", () => require("ui/layouts/grid-layout").GridLayout);
registerElement("HtmlView", () => require("ui/html-view").HtmlView);
registerElement("Image", () => require("ui/image").Image);
// Parse5 changes <Image> tags to <img>. WTF!
registerElement("img", () => require("ui/image").Image);
registerElement("Label", () => require("ui/label").Label);
registerElement("ListPicker", () => require("ui/list-picker").ListPicker);
registerElement("ListView", () => require("ui/list-view").ListView);
registerElement("Page", () => require("ui/page").Page);
registerElement("Placeholder", () => require("ui/placeholder").Placeholder);
registerElement("Progress", () => require("ui/progress").Progress);
registerElement("ProxyViewContainer", () => require("ui/proxy-view-container").ProxyViewContainer);
registerElement("Repeater", () => require("ui/repeater").Repeater);
registerElement("ScrollView", () => require("ui/scroll-view").ScrollView);
registerElement("SearchBar", () => require("ui/search-bar").SearchBar);
registerElement("SegmentedBar", () => require("ui/segmented-bar").SegmentedBar);
registerElement("SegmentedBarItem", () => require("ui/segmented-bar").SegmentedBarItem);
registerElement("Slider", () => require("ui/slider").Slider);
registerElement("StackLayout", () => require("ui/layouts/stack-layout").StackLayout);
registerElement("FlexboxLayout", () => require("ui/layouts/flexbox-layout").FlexboxLayout);
registerElement("Switch", () => require("ui/switch").Switch);
registerElement("TabView", () => require("ui/tab-view").TabView);
registerElement("TextField", () => require("ui/text-field").TextField);
registerElement("TextView", () => require("ui/text-view").TextView);
registerElement("TimePicker", () => require("ui/time-picker").TimePicker);
registerElement("WebView", () => require("ui/web-view").WebView);
registerElement("WrapLayout", () => require("ui/layouts/wrap-layout").WrapLayout);
registerElement("FormattedString", () => require("text/formatted-string").FormattedString);
registerElement("Span", () => require("text/span").Span);

registerElement("DetachedContainer", () => require("ui/proxy-view-container").ProxyViewContainer,
    { skipAddToDom: true });

registerElement("DetachedText", () => require("ui/placeholder").Placeholder,
    { skipAddToDom: true });

registerElement("Comment", () => require("ui/placeholder").Placeholder,
    { skipAddToDom: false });

