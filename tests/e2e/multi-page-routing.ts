import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { assert } from "chai";
import { ImageHelper } from "./helpers/image-helper";

describe("multi page routing", async () => {
    let driver: AppiumDriver;
    let imageHelper: ImageHelper;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
        imageHelper =  new ImageHelper(driver);
    });

    afterEach(()=>{
        imageHelper.reset();
    })

    it("navigates and returns", async () => {
        let btn = await driver.findElementByAccessibilityId("first-navigate-multi-page");
        await btn.tap();
        await imageHelper.compareScreen("first-navigate-multi-page-screen", 3);
        
        btn = await driver.findElementByAccessibilityId("second-navigate-back-multi-page");
        await btn.tap();
        await imageHelper.compareScreen("second-navigate-back-multi-page-screen", 1, 0.01);
        imageHelper.assertImages();        
    });
});
