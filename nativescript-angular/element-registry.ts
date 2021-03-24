import { View, LayoutBase, Page, Frame, AbsoluteLayout, ActivityIndicator, BottomNavigation, Button, ContentView, DatePicker, DockLayout, GridLayout, HtmlView, Image, Label, ListPicker, ListView, Placeholder, Progress, ProxyViewContainer, Repeater, ScrollView, SearchBar, SegmentedBar, SegmentedBarItem, Slider, StackLayout, FlexboxLayout, Switch, TabView, TabStrip, TabStripItem, TabContentItem, Tabs, TextField, TextView, TimePicker, WebView, WrapLayout, FormattedString, Span, RootLayout } from '@nativescript/core';

export interface ViewClass {
	new (): View;
}
export interface ViewExtensions {
	meta: ViewClassMeta;
	nodeType: number;
	nodeName: string;
	parentNode: NgView;
	nextSibling: NgView;
	previousSibling: NgView;
	firstChild: NgView;
	lastChild: NgView;
	ngCssClasses: Map<string, boolean>;
}

export type NgView = View & ViewExtensions;

export abstract class InvisibleNode extends View implements NgView {
	meta: { skipAddToDom: boolean };
	nodeType: number;
	nodeName: string;
	parentNode: NgView;
	nextSibling: NgView;
	previousSibling: NgView;
	firstChild: NgView;
	lastChild: NgView;
	ngCssClasses: Map<string, boolean>;

	constructor() {
		super();

		this.nodeType = 1;
		this.nodeName = getClassName(this);
	}

	toString() {
		return `${this.nodeName}(${this.id})`;
	}
}

export class CommentNode extends InvisibleNode {
	protected static id = 0;

	constructor() {
		super();

		this.meta = {
			skipAddToDom: true,
		};
		this.id = CommentNode.id.toString();
		CommentNode.id += 1;
	}
}

export class TextNode extends InvisibleNode {
	protected static id = 0;

	constructor() {
		super();

		this.meta = {
			skipAddToDom: true,
		};
		this.id = TextNode.id.toString();
		TextNode.id += 1;
	}
}

const getClassName = (instance) => instance.constructor.name;

export interface ViewClassMeta {
	skipAddToDom?: boolean;
	insertChild?: (parent: any, child: any, next?: any) => void;
	removeChild?: (parent: any, child: any) => void;
}

export function isDetachedElement(element): boolean {
	return element && element.meta && element.meta.skipAddToDom;
}

export function isView(view: any): view is NgView {
	return view instanceof View;
}

export function isInvisibleNode(view: any): view is InvisibleNode {
	return view instanceof InvisibleNode;
}

export type ViewResolver = () => any;

const elementMap = new Map<string, { resolver: ViewResolver; meta?: ViewClassMeta }>();
const camelCaseSplit = /([a-z0-9])([A-Z])/g;
const defaultViewMeta: ViewClassMeta = { skipAddToDom: false };

export function registerElement(elementName: string, resolver: ViewResolver, meta?: ViewClassMeta): void {
	const entry = { resolver, meta };
	elementMap.set(elementName, entry);
	elementMap.set(elementName.toLowerCase(), entry);
	elementMap.set(elementName.replace(camelCaseSplit, '$1-$2').toLowerCase(), entry);
}

export function getViewClass(elementName: string): any {
	const entry = elementMap.get(elementName) || elementMap.get(elementName.toLowerCase());
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
	const entry = elementMap.get(nodeName) || elementMap.get(nodeName.toLowerCase());
	return (entry && entry.meta) || defaultViewMeta;
}

export function isKnownView(elementName: string): boolean {
	return elementMap.has(elementName) || elementMap.has(elementName.toLowerCase());
}

export function getSingleViewRecursive(nodes: Array<any>, nestLevel: number): View {
	const actualNodes = nodes.filter((node) => !(node instanceof InvisibleNode));

	if (actualNodes.length === 0) {
		throw new Error(`No suitable views found in list template! ` + `Nesting level: ${nestLevel}`);
	} else if (actualNodes.length > 1) {
		throw new Error(`More than one view found in list template!` + `Nesting level: ${nestLevel}`);
	}

	const rootLayout = actualNodes[0];
	if (!rootLayout) {
		return getSingleViewRecursive(rootLayout.children, nestLevel + 1);
	}

	const parentLayout = rootLayout.parent;
	if (parentLayout instanceof LayoutBase) {
		let node = rootLayout.parentNode;
		parentLayout.removeChild(rootLayout);
		rootLayout.parentNode = node;
	}

	return rootLayout;
}

const frameMeta: ViewClassMeta = {
	insertChild: (parent: Frame, child: NgView, next: any) => {
		// Page cannot be added to Frame with _addChildFromBuilder (thwos "use defaultPage" error)
		if (isInvisibleNode(child)) {
			return;
		} else if (child instanceof Page) {
			parent.navigate({ create: () => child });
		} else {
			throw new Error('Only a Page can be a child of Frame');
		}
	},
};

// Register default NativeScript components
// Note: ActionBar related components are registerd together with action-bar directives.
registerElement('AbsoluteLayout', () => AbsoluteLayout);
registerElement('ActivityIndicator', () => ActivityIndicator);
registerElement('BottomNavigation', () => BottomNavigation);
registerElement('Button', () => Button);
registerElement('ContentView', () => ContentView);
registerElement('DatePicker', () => DatePicker);
registerElement('DockLayout', () => DockLayout);
registerElement('Frame', () => <any>Frame, frameMeta);
registerElement('GridLayout', () => GridLayout);
registerElement('HtmlView', () => HtmlView);
registerElement('Image', () => Image);
// Parse5 changes <Image> tags to <img>. WTF!
registerElement('img', () => Image);
registerElement('Label', () => Label);
registerElement('ListPicker', () => ListPicker);
registerElement('ListView', () => ListView);
registerElement('Page', () => Page);
registerElement('Placeholder', () => Placeholder);
registerElement('Progress', () => Progress);
registerElement('ProxyViewContainer', () => ProxyViewContainer);
registerElement('Repeater', () => Repeater);
registerElement('RootLayout', () => RootLayout);
registerElement('ScrollView', () => ScrollView);
registerElement('SearchBar', () => SearchBar);
registerElement('SegmentedBar', () => SegmentedBar);
registerElement('SegmentedBarItem', () => <any>SegmentedBarItem);
registerElement('Slider', () => Slider);
registerElement('StackLayout', () => StackLayout);
registerElement('FlexboxLayout', () => FlexboxLayout);
registerElement('Switch', () => Switch);
registerElement('TabView', () => TabView);
registerElement('TabStrip', () => TabStrip);
registerElement('TabStripItem', () => TabStripItem);
registerElement('TabContentItem', () => TabContentItem);
registerElement('Tabs', () => Tabs);
registerElement('TextField', () => TextField);
registerElement('TextView', () => TextView);
registerElement('TimePicker', () => TimePicker);
registerElement('WebView', () => WebView);
registerElement('WrapLayout', () => WrapLayout);
registerElement('FormattedString', () => <any>FormattedString);
registerElement('Span', () => <any>Span);

registerElement('DetachedContainer', () => ProxyViewContainer, {
	skipAddToDom: true,
});

registerElement('page-router-outlet', () => <any>Frame);
