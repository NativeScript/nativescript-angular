/* tslint:disable */
import { Type } from "@angular/core";
import { ɵDomAdapter, ɵsetRootDomAdapter } from "@angular/platform-browser";
import { rendererLog, isLogEnabled } from "./trace";

export class NativeScriptDomAdapter implements ɵDomAdapter {
  static makeCurrent() {
    if (isLogEnabled()) {
      rendererLog("Setting root DOM adapter...");
    }

    ɵsetRootDomAdapter(new NativeScriptDomAdapter());
  }

  hasProperty(_element: any, _name: string) {
    // TODO: actually check if the property exists.
    return true;
  }

  log(arg: any): void {
    console.log(arg);
  }

  logError(arg: any): void {
    console.log(arg);
  }

  logGroup(arg: any): void {
    console.log(arg);
  }

  logGroupEnd(): void {
  }

  get attrToPropMap(): { [key: string]: string } { throw new Error("Not implemented!"); };
  set attrToPropMap(_value: { [key: string]: string }) { throw new Error("Not implemented!"); };

  public resourceLoaderType: Type<any> = null;
  setProperty(_el: Element, _name: string, _value: any): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  getProperty(_el: Element, _name: string): any { throw new Error("Not implemented!") }
  invoke(_el: Element, _methodName: string, _args: any[]): any { throw new Error("Not implemented!") }

  contains(_nodeA: any, _nodeB: any): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  parse(_templateHtml: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  query(_selector: string): any { throw new Error("Not implemented!") }
  querySelector(_el: any /** TODO #9100 */, _selector: string): HTMLElement { throw new Error("Not implemented!") }
  querySelectorAll(_el: any /** TODO #9100 */, _selector: string): any[] { throw new Error("Not implemented!") }
  on(
    _el: any /** TODO #9100 */, _evt: any /** TODO #9100 */, _listener: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  onAndCancel(
    _el: any /** TODO #9100 */, _evt: any /** TODO #9100 */,
    _listener: any /** TODO #9100 */): Function { throw new Error("Not implemented!") }
  dispatchEvent(_el: any /** TODO #9100 */, _evt: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  createMouseEvent(_eventType: any /** TODO #9100 */): any { throw new Error("Not implemented!") }
  createEvent(_eventType: string): any { throw new Error("Not implemented!") }
  preventDefault(_evt: any /** TODO #9100 */): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  isPrevented(_evt: any /** TODO #9100 */): boolean { throw new Error("Not implemented!") }
  getInnerHTML(_el: any /** TODO #9100 */): string { throw new Error("Not implemented!") }

  getTemplateContent(_el: any /** TODO #9100 */): any { throw new Error("Not implemented!") }
  getOuterHTML(_el: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  nodeName(_node: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  nodeValue(_node: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  type(_node: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  content(_node: any /** TODO #9100 */): any { throw new Error("Not implemented!") }
  firstChild(_el: any /** TODO #9100 */): Node { throw new Error("Not implemented!") }
  nextSibling(_el: any /** TODO #9100 */): Node { throw new Error("Not implemented!") }
  parentElement(_el: any /** TODO #9100 */): Node { throw new Error("Not implemented!") }
  childNodes(_el: any /** TODO #9100 */): Node[] { throw new Error("Not implemented!") }
  childNodesAsList(_el: any /** TODO #9100 */): Node[] { throw new Error("Not implemented!") }
  clearNodes(_el: any /** TODO #9100 */): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  appendChild(_el: any /** TODO #9100 */, _node: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  removeChild(_el: any /** TODO #9100 */, _node: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  replaceChild(
    _el: any /** TODO #9100 */, _newNode: any /** TODO #9100 */,
    _oldNode: any /** TODO #9100 */): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  remove(_el: any /** TODO #9100 */): Node { throw new Error("Not implemented!") }
  insertBefore(_el: any /** TODO #9100 */, _node: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  insertAllBefore(_el: any /** TODO #9100 */, _nodes: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  insertAfter(_el: any /** TODO #9100 */, _node: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  setInnerHTML(_el: any /** TODO #9100 */, _value: any /** TODO #9100 */): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  getText(_el: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  setText(_el: any /** TODO #9100 */, _value: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  getValue(_el: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  setValue(_el: any /** TODO #9100 */, _value: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  getChecked(_el: any /** TODO #9100 */): boolean { throw new Error("Not implemented!") }
  setChecked(_el: any /** TODO #9100 */, _value: boolean): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  createComment(_text: string): any { throw new Error("Not implemented!") }
  createTemplate(_html: any /** TODO #9100 */): HTMLElement { throw new Error("Not implemented!") }
  createElement(_tagName: any /** TODO #9100 */, _doc?: any /** TODO #9100 */): HTMLElement { throw new Error("Not implemented!") }
  createElementNS(_ns: string, _tagName: string, _doc?: any /** TODO #9100 */): Element { throw new Error("Not implemented!") }
  createTextNode(_text: string, _doc?: any /** TODO #9100 */): Text { throw new Error("Not implemented!") }
  createScriptTag(_attrName: string, _attrValue: string, _doc?: any /** TODO #9100 */):
    HTMLElement { throw new Error("Not implemented!") }
  createStyleElement(_css: string, _doc?: any /** TODO #9100 */): HTMLStyleElement { throw new Error("Not implemented!") }
  createShadowRoot(_el: any /** TODO #9100 */): any { throw new Error("Not implemented!") }
  getShadowRoot(_el: any /** TODO #9100 */): any { throw new Error("Not implemented!") }
  getHost(_el: any /** TODO #9100 */): any { throw new Error("Not implemented!") }
  getDistributedNodes(_el: any /** TODO #9100 */): Node[] { throw new Error("Not implemented!") }
  clone /*<T extends Node>*/(_node: Node /*T*/): Node /*T*/ { throw new Error("Not implemented!") }
  getElementsByClassName(_element: any /** TODO #9100 */, _name: string): HTMLElement[] { throw new Error("Not implemented!") }
  getElementsByTagName(_element: any /** TODO #9100 */, _name: string): HTMLElement[] { throw new Error("Not implemented!") }
  classList(_element: any /** TODO #9100 */): any[] { throw new Error("Not implemented!") }
  addClass(_element: any /** TODO #9100 */, _className: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  removeClass(_element: any /** TODO #9100 */, _className: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  hasClass(_element: any /** TODO #9100 */, _className: string): boolean { throw new Error("Not implemented!") }
  setStyle(_element: any /** TODO #9100 */, _styleName: string, _styleValue: string): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  removeStyle(_element: any /** TODO #9100 */, _styleName: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  getStyle(_element: any /** TODO #9100 */, _styleName: string): string { throw new Error("Not implemented!") }
  hasStyle(_element: any /** TODO #9100 */, _styleName: string, _styleValue?: string):
    boolean { throw new Error("Not implemented!") }
  tagName(_element: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  attributeMap(_element: any /** TODO #9100 */): Map<string, string> { throw new Error("Not implemented!") }
  hasAttribute(_element: any /** TODO #9100 */, _attribute: string): boolean { throw new Error("Not implemented!") }
  hasAttributeNS(_element: any /** TODO #9100 */, _ns: string, _attribute: string): boolean { throw new Error("Not implemented!") }
  getAttribute(_element: any /** TODO #9100 */, _attribute: string): string { throw new Error("Not implemented!") }
  getAttributeNS(_element: any /** TODO #9100 */, _ns: string, _attribute: string): string { throw new Error("Not implemented!") }
  setAttribute(_element: any /** TODO #9100 */, _name: string, _value: string): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  setAttributeNS(_element: any /** TODO #9100 */, _ns: string, _name: string, _value: string):
    any /** TODO #9100 */ { throw new Error("Not implemented!") }
  removeAttribute(_element: any /** TODO #9100 */, _attribute: string): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  removeAttributeNS(_element: any /** TODO #9100 */, _ns: string, _attribute: string): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  templateAwareRoot(_el: any /** TODO #9100 */): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  createHtmlDocument(): HTMLDocument { throw new Error("Not implemented!") }
  defaultDoc(): HTMLDocument { throw new Error("Not implemented!") }
  getDefaultDocument(): Document { throw new Error("Not implemented!") }
  getBoundingClientRect(_el: any /** TODO #9100 */): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  getTitle(): string { throw new Error("Not implemented!") }
  setTitle(_doc: Document, _newTitle: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  elementMatches(_n: any /** TODO #9100 */, _selector: string): boolean { throw new Error("Not implemented!") }
  isTemplateElement(_el: any): boolean { throw new Error("Not implemented!") }
  isTextNode(_node: any /** TODO #9100 */): boolean { throw new Error("Not implemented!") }
  isCommentNode(_node: any /** TODO #9100 */): boolean { throw new Error("Not implemented!") }
  isElementNode(_node: any /** TODO #9100 */): boolean { throw new Error("Not implemented!") }
  hasShadowRoot(_node: any /** TODO #9100 */): boolean { throw new Error("Not implemented!") }
  isShadowRoot(_node: any /** TODO #9100 */): boolean { throw new Error("Not implemented!") }
  importIntoDoc /*<T extends Node>*/(_node: Node /*T*/): Node /*T*/ { throw new Error("Not implemented!") }
  adoptNode /*<T extends Node>*/(_node: Node /*T*/): Node /*T*/ { throw new Error("Not implemented!") }
  getHref(_element: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  getEventKey(_event: any /** TODO #9100 */): string { throw new Error("Not implemented!") }
  resolveAndSetHref(_element: any /** TODO #9100 */, _baseUrl: string, _href: string): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  supportsDOMEvents(): boolean { throw new Error("Not implemented!") }
  supportsNativeShadowDOM(): boolean { throw new Error("Not implemented!") }
  getGlobalEventTarget(_doc: Document, _target: string): any { throw new Error("Not implemented!") }
  getHistory(): History { throw new Error("Not implemented!") }
  getLocation(): Location { throw new Error("Not implemented!") }
  getBaseHref(): string { throw new Error("Not implemented!") }
  resetBaseElement(): void { throw new Error("Not implemented!") }
  getUserAgent(): string { return "Fake user agent"; }
  setData(_element: any /** TODO #9100 */, _name: string, _value: string): any
      /** TODO #9100 */ { throw new Error("Not implemented!") }
  getComputedStyle(_element: any /** TODO #9100 */): any { throw new Error("Not implemented!") }
  getData(_element: any /** TODO #9100 */, _name: string): string { throw new Error("Not implemented!") }
  setGlobalVar(_name: string, _value: any): any /** TODO #9100 */ { throw new Error("Not implemented!") }
  supportsWebAnimation(): boolean { throw new Error("Not implemented!") }
  performanceNow(): number { throw new Error("Not implemented!") }
  getAnimationPrefix(): string { throw new Error("Not implemented!") }
  getTransitionEnd(): string { throw new Error("Not implemented!") }
  supportsAnimation(): boolean { throw new Error("Not implemented!") }

  supportsCookies(): boolean { return false; }
  getCookie(_name: string): string { throw new Error("Not implemented!") }
  setCookie(_name: string, _value: string): any /** TODO #9100 */ { throw new Error("Not implemented!") }
}

NativeScriptDomAdapter.makeCurrent();
