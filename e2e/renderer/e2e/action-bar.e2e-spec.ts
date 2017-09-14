import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement
} from "nativescript-dev-appium";

import { isOnTheLeft } from "./helpers/location";

describe("Action Bar scenario", () => {
    let driver: AppiumDriver;

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logScreenshoot(this.currentTest.title);
        }
    });

    describe("dynamically add/remove ActionItems", async () => {
        let firstActionItem: UIElement;
        let secondActionItem: UIElement;
        let toggleFirstButton: UIElement;
        let toggleSecondButton: UIElement;

        before(async () => {
            driver = await createDriver();
        });

        after(async () => {
            await driver.quit(); 
            console.log("Driver quits!");
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("ActionBar dynamic", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driver.findElementByText("Action Bar Dynamic Items", SearchOptions.exact);
        });

        it("should find elements", async () => {
            firstActionItem = await driver.findElementByText("one");
            secondActionItem = await driver.findElementByText("two");

            toggleFirstButton = await driver.findElementByText("toggle 1");
            toggleSecondButton = await driver.findElementByText("toggle 2");
        });

        it("should initially render the action items in the correct order", async () => {
            await checkOrderIsCorrect();
        });

        it("should detach first element when its condition is false", done => {
            (async () => {
                await toggleFirst();

                try {
                    await driver.findElementByText("one", SearchOptions.exact);
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
                    await driver.findElementByText("two", SearchOptions.exact);
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
            await toggleFirstButton.click();
        };

        const toggleSecond = async () => {
            await toggleSecondButton.click();
        };

    });

    describe("Action Bar extension with dynamic ActionItem", async () => {
        let toggleButton: UIElement;
        let conditional: UIElement;

        before(async () => {
            driver = await createDriver();
        });

        after(async () => {
            await driver.quit();
            console.log("Driver quits!");
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("ActionBarExtension", SearchOptions.exact);
            await navigationButton.click();
        });

        it("should find elements", async () => {
            toggleButton = await driver.findElementByText("toggle");
            conditional = await driver.findElementByText("conditional");
        });

        it("should detach conditional action item when its condition is false", done => {
            (async () => {
                await toggle();

                try {
                    await driver.findElementByText("conditional", SearchOptions.exact);
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
            await toggleButton.click();
        };
    });
});
