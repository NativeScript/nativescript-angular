import { AppiumDriver } from "nativescript-dev-appium";
import { BasePage } from "./base-page";

export class HeroPage extends BasePage{
    constructor(driver: AppiumDriver) {
        super(driver);
     }

    async enterExample() {
        const exampleBtn = await this._driver.findElementByAccessibilityId("hero");
        await exampleBtn.click();
    }

    public async addActive() {
        await this.executeAction("addActive");
    }

    public async addInactive() {
        await this.executeAction("addInactive");
    }

    public async remove() {
        await this.executeAction("remove");
    }

    public async reset() {
        await this.executeAction("reset");
    }

    public async executeAction(name: string) {
        const btn = await this._driver.findElementByAccessibilityId(name);
        await btn.click();
    }
}