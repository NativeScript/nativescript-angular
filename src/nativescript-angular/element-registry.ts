import {View} from 'ui/core/view';

export interface ViewClass {
    new(): View
}

export type ViewResolver = () => ViewClass;

var elementMap: Map<string, ViewResolver> = new Map<string, ViewResolver>();

export function registerElement(elementName: string, resolver: ViewResolver): void {
    if (elementMap.has(elementName)) {
        throw new Error(`Element for ${elementName} already registered.`);
    } else {
        elementMap.set(elementName, resolver);
        elementMap.set(elementName.toLowerCase(), resolver);
    }
}

export function getViewClass(elementName: string): ViewClass {
    const resolver = elementMap.get(elementName) ||
                    elementMap.get(elementName.toLowerCase());
    if (!resolver) {
        throw new TypeError(`No known component for element ${elementName}.`);
    }
    try {
        return resolver();
    } catch (e) {
        throw new TypeError(`Could not load view for: ${elementName}.

${e}`);
    }
}

export function isKnownView(elementName: string): boolean {
    return elementMap.has(elementName) ||
            elementMap.has(elementName.toLowerCase());
}

//Register default NativeScript components
registerElement("AbsoluteLayout", () => require("ui/layouts/absolute-layout").AbsoluteLayout);
registerElement("ActionBar",  () => require("ui/action-bar").ActionBar);
registerElement("ActionItem",  () => require("ui/action-bar").ActionItem);
registerElement("ActivityIndicator",  () => require("ui/activity-indicator").ActivityIndicator);
registerElement("Border",  () => require("ui/border").Border);
registerElement("Button",  () => require("ui/button").Button);
registerElement("ContentView",  () => require("ui/content-view").ContentView);
registerElement("DatePicker",  () => require("ui/date-picker").DatePicker);
registerElement("DockLayout",  () => require("ui/layouts/dock-layout").DockLayout);
registerElement("GridLayout",  () => require("ui/layouts/grid-layout").GridLayout);
registerElement("HtmlView",  () => require("ui/html-view").HtmlView);
registerElement("Image",  () => require("ui/image").Image);
// Parse5 changes <Image> tags to <img>. WTF!
registerElement("img",  () => require("ui/image").Image);
registerElement("Label",  () => require("ui/label").Label);
registerElement("ListPicker",  () => require("ui/list-picker").ListPicker);
registerElement("ListView",  () => require("ui/list-view").ListView);
registerElement("Page",  () => require("ui/page").Page);
registerElement("Placeholder",  () => require("ui/placeholder").Placeholder);
registerElement("Progress",  () => require("ui/progress").Progress);
registerElement("Repeater",  () => require("ui/repeater").Repeater);
registerElement("ScrollView",  () => require("ui/scroll-view").ScrollView);
registerElement("SearchBar",  () => require("ui/search-bar").SearchBar);
registerElement("SegmentedBar",  () => require("ui/segmented-bar").SegmentedBar);
registerElement("Slider",  () => require("ui/slider").Slider);
registerElement("StackLayout",  () => require("ui/layouts/stack-layout").StackLayout);
registerElement("Switch",  () => require("ui/switch").Switch);
registerElement("TabView",  () => require("ui/tab-view").TabView);
registerElement("TextField",  () => require("ui/text-field").TextField);
registerElement("TextView",  () => require("ui/text-view").TextView);
registerElement("TimePicker",  () => require("ui/time-picker").TimePicker);
registerElement("WebView",  () => require("ui/web-view").WebView);
registerElement("WrapLayout",  () => require("ui/layouts/wrap-layout").WrapLayout);
