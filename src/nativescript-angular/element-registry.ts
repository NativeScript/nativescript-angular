import {View} from 'ui/core/view';
import {TypeId, ViewClass} from 'nativescript-angular/element-registry';

var elementMap: Map<string, TypeId> = new Map<string, TypeId>();

export function registerElement(elementName: string, typeId: TypeId): void {
    if (elementMap.has(elementName)) {
        throw new Error(`Element for ${elementName} already registered.`);
    } else {
        elementMap.set(elementName, typeId);
        elementMap.set(elementName.toLowerCase(), typeId);
    }
}

export function getViewClass(elementName: string): ViewClass {
    console.log('getViewClass: ' + elementName);
    let typeId = elementMap.get(elementName) ||
                    elementMap.get(elementName.toLowerCase());
    if (!typeId) {
        throw new TypeError(`No known component for element ${elementName}.`);
    }
    try {
        let module = require(typeId.moduleName);
        return module[typeId.className];
    } catch (e) {
        throw new TypeError(`Could not load type: ${typeId.moduleName}.${typeId.className}.

${e}`);
    }
}

export function isKnownView(elementName: string): boolean {
    return elementMap.has(elementName) ||
            elementMap.has(elementName.toLowerCase());
}

//Register default NativeScript components
registerElement("AbsoluteLayout", {className: "AbsoluteLayout", moduleName: "ui/layouts/absolute-layout"});
registerElement("ActionBar", {className: "ActionBar", moduleName: "ui/action-bar"});
registerElement("ActionItem", {className: "ActionItem", moduleName: "ui/action-bar"});
registerElement("ActivityIndicator", {className: "ActivityIndicator", moduleName: "ui/activity-indicator"});
registerElement("Border", {className: "Border", moduleName: "ui/border"});
registerElement("Button", {className: "Button", moduleName: "ui/button"});
registerElement("ContentView", {className: "ContentView", moduleName: "ui/content-view"});
registerElement("DatePicker", {className: "DatePicker", moduleName: "ui/date-picker"});
registerElement("DockLayout", {className: "DockLayout", moduleName: "ui/layouts/dock-layout"});
registerElement("GridLayout", {className: "GridLayout", moduleName: "ui/layouts/grid-layout"});
registerElement("HtmlView", {className: "HtmlView", moduleName: "ui/html-view"});
registerElement("Image", {className: "Image", moduleName: "ui/image"});
registerElement("Label", {className: "Label", moduleName: "ui/label"});
registerElement("ListPicker", {className: "ListPicker", moduleName: "ui/list-picker"});
registerElement("ListView", {className: "ListView", moduleName: "ui/list-view"});
registerElement("Page", {className: "Page", moduleName: "ui/page"});
registerElement("Placeholder", {className: "Placeholder", moduleName: "ui/placeholder"});
registerElement("Progress", {className: "Progress", moduleName: "ui/progress"});
registerElement("Repeater", {className: "Repeater", moduleName: "ui/repeater"});
registerElement("ScrollView", {className: "ScrollView", moduleName: "ui/scroll-view"});
registerElement("SearchBar", {className: "SearchBar", moduleName: "ui/search-bar"});
registerElement("SegmentedBar", {className: "SegmentedBar", moduleName: "ui/segmented-bar"});
registerElement("Slider", {className: "Slider", moduleName: "ui/slider"});
registerElement("StackLayout", {className: "StackLayout", moduleName: "ui/layouts/stack-layout"});
registerElement("Switch", {className: "Switch", moduleName: "ui/switch"});
registerElement("TabView", {className: "TabView", moduleName: "ui/tab-view"});
registerElement("TextField", {className: "TextField", moduleName: "ui/text-field"});
registerElement("TextView", {className: "TextView", moduleName: "ui/text-view"});
registerElement("TimePicker", {className: "TimePicker", moduleName: "ui/time-picker"});
registerElement("WebView", {className: "WebView", moduleName: "ui/web-view"});
registerElement("WrapLayout", {className: "WrapLayout", moduleName: "ui/layouts/wrap-layout"});
