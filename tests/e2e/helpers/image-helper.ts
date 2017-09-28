import { AppiumDriver } from "nativescript-dev-appium";
import { assert } from "chai";

export class ImageHelper {
    private _imagesResults = new Map<string, boolean>();
    
    constructor(private _driver: AppiumDriver) { }

    public async compareScreen(imageName, retryCounts = 1, tollerance = 0.01) {
        this._imagesResults.set(imageName, await this._driver.compareScreen(imageName, retryCounts, tollerance));
    }

    public assertImages() {
        for (let key in this._imagesResults) {
            //assert.isTrue(this._imagesResults.get(key), `Image is not correct ${key}`);
        }
    }

    public reset(){
        this._imagesResults.clear();
    }
}