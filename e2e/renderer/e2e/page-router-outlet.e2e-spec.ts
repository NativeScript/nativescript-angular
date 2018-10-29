import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement
} from "nativescript-dev-appium";
import { assert } from "chai";

describe("page-router-outlet-scenario", () => {
    let driver: AppiumDriver;

    describe("actionBarVisibility 'always' shows action bars", async () => {
        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("ActionBarVisibility Always", SearchOptions.exact);
            await navigationButton.click();

            await driver.findElementByText("ShowActionBar", SearchOptions.exact);
        });

        it("should not hide action bar by default", async () => {
            const screenMatches =  await driver.compareScreen("actionBarVisibility-always-default", 5);
            assert(screenMatches);
        });

        it("should not hide action bar when hidden by page", async () => {
            const hideActionBarButton = await driver.findElementByText("HideActionBar");
            hideActionBarButton.click();

            const screenMatches =  await driver.compareScreen("actionBarVisibility-always-hidden", 5);
            assert(screenMatches);
        });

        it("should not do anything when shown action bar by page", async () => {
            const showActionBarButton = await driver.findElementByText("ShowActionBar");
            showActionBarButton.click();

            const screenMatches =  await driver.compareScreen("actionBarVisibility-always-shown", 5);
            assert(screenMatches);
        });
    });

    describe("actionBarVisibility 'never' doesn't show action bars", async () => {
        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("ActionBarVisibility Never", SearchOptions.exact);
            await navigationButton.click();

            await driver.findElementByText("ShowActionBar", SearchOptions.exact);
        });

        it("should hide action bar by default", async () => {
            const screenMatches =  await driver.compareScreen("actionBarVisibility-never-default", 5);
            assert(screenMatches);
        });

        it("should not show action bar when shown by page", async () => {
            const showActionBarButton = await driver.findElementByText("ShowActionBar");
            showActionBarButton.click();

            const screenMatches =  await driver.compareScreen("actionBarVisibility-never-shown", 5);
            assert(screenMatches);
        });

        it("should not do anything when hidden action bar by page", async () => {
            const hideActionBarButton = await driver.findElementByText("HideActionBar");
            hideActionBarButton.click();

            const screenMatches =  await driver.compareScreen("actionBarVisibility-never-hidden", 5);
            assert(screenMatches);
        });
    });

    describe("actionBarVisibility 'auto' shows action bars based on page", async () => {
        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("ActionBarVisibility Auto", SearchOptions.exact);
            await navigationButton.click();

            await driver.findElementByText("ShowActionBar", SearchOptions.exact);
        });

        it("should show action bar by default", async () => {
            const screenMatches =  await driver.compareScreen("actionBarVisibility-auto-default", 5);
            assert(screenMatches);
        });

        it("should hide action bar when hidden by page", async () => {
            const hideActionBarButton = await driver.findElementByText("HideActionBar");
            hideActionBarButton.click();

            const screenMatches =  await driver.compareScreen("actionBarVisibility-auto-hidden", 5);
            assert(screenMatches);
        });

        it("should show action bar when shown by page", async () => {
            const showActionBarButton = await driver.findElementByText("ShowActionBar");
            showActionBarButton.click();

            const screenMatches =  await driver.compareScreen("actionBarVisibility-auto-shown", 5);
            assert(screenMatches);
        });
    });
});
