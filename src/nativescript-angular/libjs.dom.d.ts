//
// Types needed by Angular 2.
// TODO: remove when we get rid of no-default-lib="true"
//

declare var window: Window;
declare var document: any;

interface Window {
    document: /*Document*/ any;
    location: /*Location*/ any;
}

interface EventInit {
    bubbles?: boolean;
    cancelable?: boolean;
}

interface Event {
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    currentTarget: EventTarget;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    returnValue: boolean;
    srcElement: /*Element*/ any;
    target: EventTarget;
    timeStamp: number;
    type: string;
    initEvent(eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean): void;
    preventDefault(): void;
    stopImmediatePropagation(): void;
    stopPropagation(): void;
    AT_TARGET: number;
    BUBBLING_PHASE: number;
    CAPTURING_PHASE: number;
}

declare var Event: {
    prototype: Event;
    new(type: string, eventInitDict?: EventInit): Event;
    AT_TARGET: number;
    BUBBLING_PHASE: number;
    CAPTURING_PHASE: number;
}

interface EventListener {
    (evt: Event): void;
}

interface EventListenerObject {
    handleEvent(evt: Event): void;
}

declare type EventListenerOrEventListenerObject = EventListener | EventListenerObject;

interface EventTarget {
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    dispatchEvent(evt: Event): boolean;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

declare var EventTarget: {
    prototype: EventTarget;
    new(): EventTarget;
}

interface NamedNodeMap {
    length: number;
    getNamedItem(name: string): Attr;
    getNamedItemNS(namespaceURI: string, localName: string): Attr;
    item(index: number): Attr;
    removeNamedItem(name: string): Attr;
    removeNamedItemNS(namespaceURI: string, localName: string): Attr;
    setNamedItem(arg: Attr): Attr;
    setNamedItemNS(arg: Attr): Attr;
    [index: number]: Attr;
}

declare var NamedNodeMap: {
    prototype: NamedNodeMap;
    new(): NamedNodeMap;
}

interface Node extends EventTarget {
    attributes: NamedNodeMap;
    baseURI: string;
    childNodes: NodeList;
    firstChild: Node;
    lastChild: Node;
    localName: string;
    namespaceURI: string;
    nextSibling: Node;
    nodeName: string;
    nodeType: number;
    nodeValue: string;
    ownerDocument: /*Document*/ any;
    parentElement: /*HTMLElement*/ any;
    parentNode: Node;
    prefix: string;
    previousSibling: Node;
    textContent: string;
    appendChild(newChild: Node): Node;
    cloneNode(deep?: boolean): Node;
    compareDocumentPosition(other: Node): number;
    hasAttributes(): boolean;
    hasChildNodes(): boolean;
    insertBefore(newChild: Node, refChild?: Node): Node;
    isDefaultNamespace(namespaceURI: string): boolean;
    isEqualNode(arg: Node): boolean;
    isSameNode(other: Node): boolean;
    lookupNamespaceURI(prefix: string): string;
    lookupPrefix(namespaceURI: string): string;
    normalize(): void;
    removeChild(oldChild: Node): Node;
    replaceChild(newChild: Node, oldChild: Node): Node;
    ATTRIBUTE_NODE: number;
    CDATA_SECTION_NODE: number;
    COMMENT_NODE: number;
    DOCUMENT_FRAGMENT_NODE: number;
    DOCUMENT_NODE: number;
    DOCUMENT_POSITION_CONTAINED_BY: number;
    DOCUMENT_POSITION_CONTAINS: number;
    DOCUMENT_POSITION_DISCONNECTED: number;
    DOCUMENT_POSITION_FOLLOWING: number;
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    DOCUMENT_POSITION_PRECEDING: number;
    DOCUMENT_TYPE_NODE: number;
    ELEMENT_NODE: number;
    ENTITY_NODE: number;
    ENTITY_REFERENCE_NODE: number;
    NOTATION_NODE: number;
    PROCESSING_INSTRUCTION_NODE: number;
    TEXT_NODE: number;
}

declare var Node: {
    prototype: Node;
    new(): Node;
    ATTRIBUTE_NODE: number;
    CDATA_SECTION_NODE: number;
    COMMENT_NODE: number;
    DOCUMENT_FRAGMENT_NODE: number;
    DOCUMENT_NODE: number;
    DOCUMENT_POSITION_CONTAINED_BY: number;
    DOCUMENT_POSITION_CONTAINS: number;
    DOCUMENT_POSITION_DISCONNECTED: number;
    DOCUMENT_POSITION_FOLLOWING: number;
    DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number;
    DOCUMENT_POSITION_PRECEDING: number;
    DOCUMENT_TYPE_NODE: number;
    ELEMENT_NODE: number;
    ENTITY_NODE: number;
    ENTITY_REFERENCE_NODE: number;
    NOTATION_NODE: number;
    PROCESSING_INSTRUCTION_NODE: number;
    TEXT_NODE: number;
}

interface Attr extends Node {
    name: string;
    ownerElement: /*Element*/ any;
    specified: boolean;
    value: string;
}

declare var Attr: {
    prototype: Attr;
    new(): Attr;
}

interface NodeList {
    length: number;
    item(index: number): Node;
    [index: number]: Node;
}

declare var NodeList: {
    prototype: NodeList;
    new(): NodeList;
}

////////// empty -- used by hammer.js

interface HTMLElement {
}

interface MouseEvent {
}

interface PointerEvent {
}

interface TouchEvent {
}
