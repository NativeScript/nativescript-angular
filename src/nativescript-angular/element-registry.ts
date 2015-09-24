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
registerElement("Button", {className: "Button", moduleName: "ui/button"});
registerElement("Label", {className: "Label", moduleName: "ui/label"});
registerElement("TextField", {className: "TextField", moduleName: "ui/text-field"});
registerElement("TextView", {className: "TextView", moduleName: "ui/text-view"});
registerElement("Switch", {className: "Switch", moduleName: "ui/switch"});
registerElement("StackLayout", {className: "StackLayout", moduleName: "ui/layouts/stack-layout"});
registerElement("DockLayout", {className: "DockLayout", moduleName: "ui/layouts/dock-layout"});
