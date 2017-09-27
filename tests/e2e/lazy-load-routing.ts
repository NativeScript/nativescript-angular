import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { assert } from "chai";
import {  initialDisplayName } from "./const";

describe("lazy load routing", async function () {
    let driver: AppiumDriver;
    const imagesResults = new Map<string, boolean>();
    const lazyLoadedDisplay = "lazyLoadedDisplay";

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach("clear image results", () => {
        imagesResults.clear();
    });

    const loadFirstLazyLoadPage = async () => {
        await (await driver.findElementByAccessibilityId("first-navigate-lazy-load")).tap();
    }

    it("loads default path", async () => {
        const initDisplay = await driver.compareScreen(initialDisplayName, 1, 0.01);
        assert.isTrue(initDisplay);
    });

    it("navigates and returns", async () => {
        await loadFirstLazyLoadPage();
        compareScreen(lazyLoadedDisplay);
        
        const btn = await driver.findElementByAccessibilityId("second-navigate-back-lazy-load");
        btn.tap();
        compareScreen(initialDisplayName);
        
        assertImages();
    });

    it("navigates and clear history", async () => {
        await loadFirstLazyLoadPage();
        compareScreen(lazyLoadedDisplay);

        await driver.navBack();
        compareScreen(initialDisplayName);
        
        assertImages();
    });

    async function compareScreen(imageName){
        imagesResults.set(lazyLoadedDisplay, await driver.compareScreen("lazyLoaded", 1, 0.01));        
    }

    function assertImages(){
        for (let key in imagesResults) {
            assert.isTrue(imagesResults.get(key), `Image is not correct ${key}`);
        }
    }
});
