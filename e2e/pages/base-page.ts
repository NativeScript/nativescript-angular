import { AppiumDriver, ElementHelper, UIElement } from "nativescript-dev-appium";

export class BasePage {
    protected _elementHelper: ElementHelper;

    constructor(protected _driver: AppiumDriver) {
        this._elementHelper = new ElementHelper(this._driver.nsCapabilities);
    }

    async waitElementTo(element: () => Promise<UIElement>, shouldBeVisible: boolean, wait: number) {
        const start = Date.now();
        let btn = await element();
        while ((await this.isBtnDisplayed(btn)) !== shouldBeVisible && Date.now() - start <= wait) {
            btn = await element();
        }

        return { isVisible: await this.isBtnDisplayed(btn), element: btn };
    }

    async isBtnDisplayed(element: UIElement) {
        let btn: UIElement = await element;
        let isBtnDisplayed = false
        try {
            isBtnDisplayed = btn ? await btn.isDisplayed() : false;
        } catch (error) { }

        return isBtnDisplayed;
    }
}