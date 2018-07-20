import { AppiumDriver, ElementHelper } from "nativescript-dev-appium";

export class BasePage {
    protected _elementHelper: ElementHelper;

    constructor(protected _driver: AppiumDriver) {
        this._elementHelper = new ElementHelper(this._driver.nsCapabilities);
    }
}