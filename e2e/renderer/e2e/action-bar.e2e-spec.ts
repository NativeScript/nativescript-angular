import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    elementHelper,
} from "nativescript-dev-appium";

import { isOnTheLeft } from "./helpers/location";
import { DriverWrapper, ExtendedUIElement } from "./helpers/appium-elements";

describe("Action Bar scenario", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;

    describe("dynamically add/remove ActionItems", async () => {
        let firstActionItem: ExtendedUIElement;
        let secondActionItem: ExtendedUIElement;
        let toggleFirstButton: ExtendedUIElement;
        let toggleSecondButton: ExtendedUIElement;

        before(async () => {
            driver = await createDriver();
            driverWrapper = new DriverWrapper(driver);
        });

        after(async () => {
            await driver.quit();
            console.log("Driver quits!");
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driverWrapper.findElementByText("ActionBar dynamic", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driverWrapper.findElementByText("Action Bar Dynamic Items", SearchOptions.exact);
        });

        it("should find elements", async () => {
            firstActionItem = await driverWrapper.findElementByText("one");
            secondActionItem = await driverWrapper.findElementByText("two");

            toggleFirstButton = await driverWrapper.findElementByText("toggle 1");
            toggleSecondButton = await driverWrapper.findElementByText("toggle 2");
        });

        it("should initially render the action items in the correct order", async () => {
            await checkOrderIsCorrect();
        });

        it("should detach first element when its condition is false", done => {
            (async () => {
                await toggleFirst();

                try {
                    await driverWrapper.findElementByText("one", SearchOptions.exact);
                } catch (e) {
                    done();
                }
            })();
        });

        it("should attach first element in the correct position", async () => {
            await toggleFirst();
            await checkOrderIsCorrect();
        });

        it("should detach second element when its condition is false", done => {
            (async () => {
                await toggleSecond();

                try {
                    await driverWrapper.findElementByText("two", SearchOptions.exact);
                } catch (e) {
                    done();
                }
            })();
        });

        it("should attach second element in the correct position", async () => {
            await toggleSecond();
            await checkOrderIsCorrect();
        });

        it("should detach and then reattach both at correct places", async () => {
            await toggleFirst();
            await toggleSecond();

            await toggleFirst();
            await toggleSecond();

            await checkOrderIsCorrect();
        });

        const checkOrderIsCorrect = async () => {
            await isOnTheLeft(firstActionItem, secondActionItem);
        };

        const toggleFirst = async () => {
            toggleFirstButton = await toggleFirstButton.refetch();
            await toggleFirstButton.click();
        };

        const toggleSecond = async () => {
            toggleSecondButton = await toggleSecondButton.refetch();
            await toggleSecondButton.click();
        };

    });

    describe("Action Bar extension with dynamic ActionItem", async () => {
        let toggleButton: ExtendedUIElement;
        let conditional: ExtendedUIElement;

        before(async () => {
            driver = await createDriver();
            driverWrapper = new DriverWrapper(driver);
        });

        after(async () => {
            await driver.quit();
            console.log("Driver quits!");
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driverWrapper.findElementByText("ActionBarExtension", SearchOptions.exact);
            await navigationButton.click();
        });

        it("should find elements", async () => {
            toggleButton = await driverWrapper.findElementByText("toggle");
            conditional = await driverWrapper.findElementByText("conditional");
        });

        it("should detach conditional action item when its condition is false", done => {
            (async () => {
                await toggle();

                try {
                    await driverWrapper.findElementByText("conditional", SearchOptions.exact);
                } catch (e) {
                    done();
                }
            })();
        });

        it("should reattach conditional action item at correct place", async () => {
            await toggle();
            await checkOrderIsCorrect();
        });
        
        const checkOrderIsCorrect = async () => {
            await isOnTheLeft(toggleButton, conditional);
        };

        const toggle = async () => {
            toggleButton = await toggleButton.refetch();
            await toggleButton.click();
        };
    });
});
