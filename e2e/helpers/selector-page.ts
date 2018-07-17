import { AppiumDriver, UIElement } from "nativescript-dev-appium";
import { assert } from "chai";
import { sort } from "./utils";

export class SelectorPage {
    private _btnAddItem: UIElement;
    constructor(private _driver: AppiumDriver) { }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("selector");
        await exampleBtn.click();
    }

    async addItem() {
        this._btnAddItem = await this._driver.findElementByAccessibilityId("add");

        await this._btnAddItem.tap();
    }

    async clickOnItem(item: string) {
        const btn = await this._driver.findElementByXPath(`//*[@name="itemsContainer"]//*[@name="${item}"]`);

        await btn.tap();
    }

    async getChildren() {
        const children: Array<UIElement> = await this._driver.findElementsByXPath('//*[@name="itemsContainer"]/*');
        const orderedList: Array<UIElement> = await sort(children);

        return orderedList;
    }

    async assertElementPossition(expctedElementsCount: number) {
        const children = await this.getChildren();
        assert.isTrue(children.length === expctedElementsCount)
        for (let index = 0; index < children.length - 1; index++) {
            const element = children[index];
            const el = await (<any>element.driver()).elementByXPathIfExists(`//*[@name="Item No.${index}"]`);
            console.log(await el.text());
            assert.isTrue(el && el !== null);
        }
    }

    async isBtnDisplayed() {
        return await this._btnAddItem.isDisplayed();
    }
}


// setImmediateValueInApp:function () { … }
// setText:function () { … }
// should:Proxy
// sleep:function () { … }
// submit:function () { … }
// tap:function () { … }
// text:function () { … }
// textPresent:function () { … }
// type:function () { … }
// null: PromiseElement {value: "9C010000-0000-0000-523B-000000000000", browser: PromiseWebdriver}
// browser: PromiseWebdriver {domain: null, _events: Object, _eventsCount: 3, …}
// should: Proxy
// value: "9C010000-0000-0000-523B-000000000000"
// __proto__: Element {isPromised: true, type: , keys: , …}
// _enrich: function (target) { … }
// chain: function () { … }
// clear: function () { … }
// click: function () { … }
// displayed: function () { … }
// doubleclick: function () { … }
// doubleClick: function () { … }
// element: function () { … }
// elementByAccessibilityId: function () { … }
// elementByAndroidUIAutomator: function () { … }
// elementByClassName: function () { … }
// elementByCss: function () { … }
// elementByCssSelector: function () { … }
// elementById: function () { … }
// elementByIosClassChain: function () { … }
// elementByIosUIAutomation: function () { … }
// elementByLinkText: function () { … }
// elementByName: function () { … }
// elementByPartialLinkText: function () { … }
// elementByTagName: function () { … }
// elementByXPath: function () { … }
// elements: function () { … }
// elementsByAccessibilityId: function () { … }
// elementsByAndroidUIAutomator: function () { … }
// elementsByClassName: function () { … }
// elementsByCss: function () { … }
// elementsByCssSelector: function () { … }
// elementsById: function () { … }
// elementsByIosClassChain: function () { … }
// elementsByIosUIAutomation: function () { … }
// elementsByLinkText: function () { … }
// elementsByName: function () { … }
// elementsByPartialLinkText: function () { … }
// elementsByTagName: function () { … }
// elementsByXPath: function () { … }
// enabled: function () { … }
// equals: function () { … }
// flick: function () { … }
// getAttribute: function () { … }
// getComputedCss: function () { … }
// getComputedCSS: function () { … }
// getLocation: function () { … }
// getLocationInView: function () { … }
// getSize: function () { … }
// getTagName: function () { … }
// getValue: function () { … }
// isDisplayed: function () { … }
// isEnabled: function () { … }
// isPromised: true
// isSelected: function () { … }
// isVisible: function () { … }
// keys: function () { … }
// moveTo: function () { … }
// noop: function () { … }
// performMultiAction: function () { … }
// replaceKeys: function () { … }
// resolve: function (promise) { … }
// rotate: function () { … }
// selected: function () { … }
// sendKeys: function () { … }
// setImmediateValue: function () { … }
// setImmediateValueInApp: function () { … }
// setText: function () { … }
// should: Proxy
// sleep: function () { … }
// submit: function () { … }
// tap: function () { … }
// text: function () { … }
// textPresent: function () { … }
// type: function () { … }
// __proto__: Object {emit: , toString: , toJSON: , …}
// clear: function () { … }
// click: function () { … }
// constructor: function (value, browser) { … }
// displayed: function () { … }
// doubleclick: function () { … }
// doubleClick: function () { … }
// element: function () { … }
// elementByAccessibilityId: function () { … }
// elementByAndroidUIAutomator: function () { … }
// elementByClassName: function () { … }
// elementByCss: function () { … }
// elementByCssSelector: function () { … }
// elementById: function () { … }
// elementByIosClassChain: function () { … }
// elementByIosUIAutomation: function () { … }
// elementByLinkText: function () { … }
// elementByName: function () { … }
// elementByPartialLinkText: function () { … }
// elementByTagName: function () { … }
// elementByXPath: function () { … }
// elements: function () { … }
// elementsByAccessibilityId: function () { … }
// elementsByAndroidUIAutomator: function () { … }
// elementsByClassName: function () { … }
// elementsByCss: function () { … }
// elementsByCssSelector: function () { … }
// elementsById: function () { … }
// elementsByIosClassChain: function () { … }
// elementsByIosUIAutomation: function () { … }
// elementsByLinkText: function () { … }
// elementsByName: function () { … }
// elementsByPartialLinkText: function () { … }
// elementsByTagName: function () { … }
// elementsByXPath: function () { … }
// emit: function () { … }
// enabled: function () { … }
// equals: function () { … }
// flick: function () { … }
// getAttribute: function () { … }
// getComputedCss: function () { … }
// getComputedCSS: function () { … }
// getLocation: function () { … }
// getLocationInView: function () { … }
// getSize: function () { … }
// getTagName: function () { … }
// getValue: function () { … }
// isDisplayed: function () { … }
// isEnabled: function () { … }
// isSelected: function () { … }
// isVisible: function () { … }
// keys: function () { … }
// moveTo: function () { … }
// noop: function () { … }
// performMultiAction: function () { … }
// replaceKeys: function () { … }
// rotate: function () { … }
// selected: function () { … }
// sendKeys: function () { … }
// setImmediateValue: function () { … }
// setImmediateValueInApp: function () { … }
// setText: function () { … }
// should: Proxy
// sleep: function () { … }
// submit: function () { … }
// tap: function () { … }
// text: function () { … }
// textPresent: function () { … }
// toJSON: function () { … }
// toString: function () { … }
// type: function () { … }

// PromiseElement 


// PromiseWebdriver
// browser: PromiseWebdriver {domain: null, _events: Object, _eventsCount: 3, …}
// _events: Object {status: , command: , http: }
// _eventsCount: 3
// _httpConfig: Object {timeout: undefined, retries: 3, retryDelay: 15, …}
// _maxListeners: undefined
// configUrl: Url {protocol: "http:", slashes: true, auth: null, …}
// defaultCapabilities: Object {browserName: "firefox", version: "", javascriptEnabled: true, …}
// domain: null
// noAuthConfigUrl: Url {protocol: "http:", slashes: true, host: "localhost:4723", …}
// sampleElement: PromiseElement {value: 1, browser: PromiseWebdriver}
// sauceRestRoot: "https://saucelabs.com/rest/v1"
// sauceTestPageRoot: "https://saucelabs.com/jobs"
// sessionID: "f3bc1279-638d-467c-b6a6-ce13844ad71f"
// should: Proxy
// __proto__: module.exports {isPromised: true, defaultChainingScope: "browser", getDefaultChainingScope: , …}
// _debugPromise: function () { … }
// _enrich: function (obj, currentEl) { … }
// acceptAlert: function () { … }
// activateIMEEngine: function () { … }
// active: function () { … }
// activeIMEEngine: function () { … }
// alertKeys: function () { … }
// alertText: function () { … }
// allCookies: function () { … }
// altSessionCapabilities: function () { … }
// attach: function () { … }
// availableIMEEngines: function () { … }
// back: function () { … }
// backgroundApp: function () { … }
// buttonDown: function () { … }
// buttonUp: function () { … }
// chain: function () { … }
// clear: function () { … }
// clearLocalStorage: function () { … }
// click: function () { … }
// clickElement: function () { … }
// close: function () { … }
// closeApp: function () { … }
// complexFind: function () { … }
// complexFindInApp: function () { … }
// configureHttp: function () { … }
// context: function () { … }
// contexts: function () { … }
// currentContext: function () { … }
// deactivateIMEEngine: function () { … }
// defaultChainingScope: "browser"
// deleteAllCookies: function () { … }
// deleteCookie: function () { … }
// detach: function () { … }
// deviceKeyEvent: function () { … }
// dismissAlert: function () { … }
// displayed: function () { … }
// doubleclick: function () { … }
// element: function () { … }
// elementByAccessibilityId: function () { … }
// elementByAccessibilityIdIfExists: function () { … }
// elementByAccessibilityIdOrNull: function () { … }
// elementByAndroidUIAutomator: function () { … }
// elementByAndroidUIAutomatorIfExists: function () { … }
// elementByAndroidUIAutomatorOrNull: function () { … }
// elementByClassName: function () { … }
// elementByClassNameIfExists: function () { … }
// elementByClassNameOrNull: function () { … }
// elementByCss: function () { … }
// elementByCssIfExists: function () { … }
// elementByCssOrNull: function () { … }
// elementByCssSelector: function () { … }
// elementByCssSelectorIfExists: function () { … }
// elementByCssSelectorOrNull: function () { … }
// elementById: function () { … }
// elementByIdIfExists: function () { … }
// elementByIdOrNull: function () { … }
// elementByIosClassChain: function () { … }
// elementByIosClassChainIfExists: function () { … }
// elementByIosClassChainOrNull: function () { … }
// elementByIosUIAutomation: function () { … }
// elementByIosUIAutomationIfExists: function () { … }
// elementByIosUIAutomationOrNull: function () { … }
// elementByLinkText: function () { … }
// elementByLinkTextIfExists: function () { … }
// elementByLinkTextOrNull: function () { … }
// elementByName: function () { … }
// elementByNameIfExists: function () { … }
// elementByNameOrNull: function () { … }
// elementByPartialLinkText: function () { … }
// elementByPartialLinkTextIfExists: function () { … }
// elementByPartialLinkTextOrNull: function () { … }
// elementByTagName: function () { … }
// elementByTagNameIfExists: function () { … }
// elementByTagNameOrNull: function () { … }
// elementByXPath: function () { … }
// elementByXPathIfExists: function () { … }
// elementByXPathOrNull: function () { … }
// elementIfExists: function () { … }
// elementOrNull: function () { … }
// elements: function () { … }
// elementsByAccessibilityId: function () { … }
// elementsByAndroidUIAutomator: function () { … }
// elementsByClassName: function () { … }
// elementsByCss: function () { … }
// elementsByCssSelector: function () { … }
// elementsById: function () { … }
// elementsByIosClassChain: function () { … }
// elementsByIosUIAutomation: function () { … }
// elementsByLinkText: function () { … }
// elementsByName: function () { … }
// elementsByPartialLinkText: function () { … }
// elementsByTagName: function () { … }
// elementsByXPath: function () { … }
// enabled: function () { … }
// endCoverage: function () { … }
// endTestCoverage: function () { … }
// endTestCoverageForApp: function () { … }
// equalsElement: function () { … }
// eval: function () { … }
// execute: function () { … }
// executeAsync: function () { … }
// fingerprint: function () { … }
// flick: function () { … }
// forward: function () { … }
// frame: function () { … }
// get: function () { … }
// getAppStrings: function () { … }
// getAttribute: function () { … }
// getClipboard: function () { … }
// getComputedCss: function () { … }
// getComputedCSS: function () { … }
// getCurrentActivity: function () { … }
// getCurrentDeviceActivity: function () { … }
// getCurrentPackage: function () { … }
// getDefaultChainingScope: function () { … }
// getDeviceTime: function () { … }
// getGeoLocation: function () { … }
// getLocalStorageKey: function () { … }
// getLocation: function () { … }
// getLocationInView: function () { … }
// getNetworkConnection: function () { … }
// getOrientation: function () { … }
// getPageIndex: function () { … }
// getSessionId: function () { … }
// getSessionID: function () { … }
// getSize: function () { … }
// getTagName: function () { … }
// getValue: function () { … }
// getWindowPosition: function () { … }
// getWindowSize: function () { … }
// gsmCall: function () { … }
// gsmSignal: function () { … }
// gsmSignalStrength: function () { … }
// gsmVoice: function () { … }
// gsmVoiceState: function () { … }
// hasElement: function () { … }
// hasElementByAccessibilityId: function () { … }
// hasElementByAndroidUIAutomator: function () { … }
// hasElementByClassName: function () { … }
// hasElementByCss: function () { … }
// hasElementByCssSelector: function () { … }
// hasElementById: function () { … }
// hasElementByIosClassChain: function () { … }
// hasElementByIosUIAutomation: function () { … }
// hasElementByLinkText: function () { … }
// hasElementByName: function () { … }
// hasElementByPartialLinkText: function () { … }
// hasElementByTagName: function () { … }
// hasElementByXPath: function () { … }
// hideDeviceKeyboard: function () { … }
// hideKeyboard: function () { … }
// init: function () { … }
// installApp: function () { … }
// installAppOnDevice: function () { … }
// isAppInstalled: function () { … }
// isAppInstalledOnDevice: function () { … }
// isDisplayed: function () { … }
// isEnabled: function () { … }
// isIMEActive: function () { … }
// isKeyboardShown: function () { … }
// isLocked: function () { … }
// isPromised: true
// isSelected: function () { … }
// isVisible: function () { … }
// keys: function () { … }
// launchApp: function () { … }
// lock: function () { … }
// lockDevice: function () { … }
// log: function () { … }
// logTypes: function () { … }
// maximize: function () { … }
// moveTo: function () { … }
// networkSpeed: function () { … }
// newElement: function (jsonWireElement) { … }
// newWindow: function () { … }
// noop: function () { … }
// openNotifications: function () { … }
// performMultiAction: function () { … }
// performTouchAction: function () { … }
// powerAC: function () { … }
// powerCapacity: function () { … }
// powerChargerState: function () { … }
// pressDeviceKey: function () { … }
// pressKeycode: function () { … }
// pullFile: function () { … }
// pullFileFromDevice: function () { … }
// pullFolder: function () { … }
// pullFolderFromDevice: function () { … }
// pushFile: function () { … }
// pushFileToDevice: function () { … }
// quit: function () { … }
// refresh: function () { … }
// removeApp: function () { … }
// removeAppFromDevice: function () { … }
// removeLocalStorageKey: function () { … }
// replace: function () { … }
// resetApp: function () { … }
// resolve: function (promise) { … }
// rotate: function () { … }
// rotateDevice: function () { … }
// safeEval: function () { … }
// safeExecute: function () { … }
// safeExecuteAsync: function () { … }
// sauceJobStatus: function () { … }
// sauceJobUpdate: function () { … }
// saveScreenshot: function () { … }
// scroll: function () { … }
// sendSms: function () { … }
// sessionCapabilities: function () { … }
// sessions: function () { … }
// setAsyncScriptTimeout: function () { … }
// setClipboard: function () { … }
// setCommandTimeout: function () { … }
// setCookie: function () { … }
// setGeoLocation: function () { … }
// setHTTPInactivityTimeout: function () { … }
// setHttpTimeout: function () { … }
// setImmediateValue: function () { … }
// setImmediateValueInApp: function () { … }
// setImplicitWaitTimeout: function () { … }
// setLocalStorageKey: function () { … }
// setNetworkConnection: function () { … }
// setOrientation: function () { … }
// setPageLoadTimeout: function () { … }
// settings: function () { … }
// setWaitTimeout: function () { … }
// setWindowPosition: function () { … }
// setWindowSize: function () { … }
// shake: function () { … }
// shakeDevice: function () { … }
// should: Proxy
// sleep: function () { … }
// source: function () { … }
// startActivity: function () { … }
// status: function () { … }
// submit: function () { … }
// takeScreenshot: function () { … }
// tapElement: function () { … }
// text: function () { … }
// textPresent: function () { … }
// title: function () { … }
// toggleAirplaneMode: function () { … }
// toggleAirplaneModeOnDevice: function () { … }
// toggleData: function () { … }
// toggleDataOnDevice: function () { … }
// toggleFlightMode: function () { … }
// toggleLocationServices: function () { … }
// toggleLocationServicesOnDevice: function () { … }
// toggleTouchIdEnrollment: function () { … }
// toggleWiFi: function () { … }
// toggleWiFiOnDevice: function () { … }
// touchId: function () { … }
// type: function () { … }
// unlock: function () { … }
// unlockDevice: function () { … }
// updateSettings: function () { … }
// uploadFile: function () { … }
// url: function () { … }
// waitFor: function () { … }
// waitForCondition: function () { … }
// waitForConditionInBrowser: function () { … }
// waitForElement: function () { … }
// waitForElementByAccessibilityId: function () { … }
// waitForElementByAndroidUIAutomator: function () { … }
// waitForElementByClassName: function () { … }
// waitForElementByCss: function () { … }
// waitForElementByCssSelector: function () { … }
// waitForElementById: function () { … }
// waitForElementByIosClassChain: function () { … }
// waitForElementByIosUIAutomation: function () { … }
// waitForElementByLinkText: function () { … }
// waitForElementByName: function () { … }
// waitForElementByPartialLinkText: function () { … }
// waitForElementByTagName: function () { … }
// waitForElementByXPath: function () { … }
// waitForElements: function () { … }
// waitForElementsByAccessibilityId: function () { … }
// waitForElementsByAndroidUIAutomator: function () { … }
// waitForElementsByClassName: function () { … }
// waitForElementsByCss: function () { … }
// waitForElementsByCssSelector: function () { … }
// waitForElementsById: function () { … }
// waitForElementsByIosClassChain: function () { … }
// waitForElementsByIosUIAutomation: function () { … }
// waitForElementsByLinkText: function () { … }
// waitForElementsByName: function () { … }
// waitForElementsByPartialLinkText: function () { … }
// waitForElementsByTagName: function () { … }
// waitForElementsByXPath: function () { … }
// waitForJsCondition: function () { … }
// waitForVisible: function () { … }
// waitForVisibleByAccessibilityId: function () { … }
// waitForVisibleByAndroidUIAutomator: function () { … }
// waitForVisibleByClassName: function () { … }
// waitForVisibleByCss: function () { … }
// waitForVisibleByCssSelector: function () { … }
// waitForVisibleById: function () { … }
// waitForVisibleByIosClassChain: function () { … }
// waitForVisibleByIosUIAutomation: function () { … }
// waitForVisibleByLinkText: function () { … }
// waitForVisibleByName: function () { … }
// waitForVisibleByPartialLinkText: function () { … }
// waitForVisibleByTagName: function () { … }
// waitForVisibleByXPath: function () { … }
// window: function () { … }
// windowHandle: function () { … }
// windowHandles: function () { … }
// windowName: function () { … }
// windowSize: function () { … }
// __proto__: EventEmitter {newElement: , attach: , detach: , …}
// should: Proxy
// value: "9C010000-0000-0000-523B-000000000000"
// __proto__: Element {isPromised: true, type: , keys: , …}