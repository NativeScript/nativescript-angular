import {
    AppiumDriver,
    createDriver,
    SearchOptions,
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";
import { DriverWrapper, ExtendedUIElement } from "./helpers/appium-elements";

import { assert } from "chai";

describe("ngIf scenario", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;
    let toggleButton: ExtendedUIElement;

    describe("without layout", async () => {
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
                await driverWrapper.findElementByText("NgIf no layout", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driverWrapper.findElementByText("ngIf - no layout", SearchOptions.exact);
        });

        it("should find elements", async () => {
            await driverWrapper.findElementByText("false", SearchOptions.exact);
            toggleButton = await driverWrapper.findElementByText("Toggle", SearchOptions.exact);
        });

        it("show 'true' button when show is true", async () => {
            toggleButton = await toggleButton.refetch();
            await toggleButton.click();

            await driverWrapper.findElementByText("true", SearchOptions.exact);
        });
    });

    describe("label inbetween", async () => {
        let firstButton: ExtendedUIElement;
        let secondButton: ExtendedUIElement;
        let conditionalLabel: ExtendedUIElement;
        let toggle: ExtendedUIElement;

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
                await driverWrapper.findElementByText("NgIf inbetween", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driverWrapper.findElementByText("ngIf - inbetween", SearchOptions.exact);
        });

        it("should find elements", async () => {
            firstButton = await driverWrapper.findElementByText("Button 1", SearchOptions.exact);
            secondButton = await driverWrapper.findElementByText("Button 2", SearchOptions.exact);
            toggleButton = await driverWrapper.findElementByText("Toggle", SearchOptions.exact);

            conditionalLabel = await driverWrapper.findElementByText("Label", SearchOptions.exact);
            const labelIsDisplayed = await conditionalLabel.isDisplayed();
            assert.isTrue(labelIsDisplayed);
        });

        it("detach label when condition is false", done => {
            (async () => {
                toggleButton = await toggleButton.refetch();
                await toggleButton.click();

                try {
                    await driverWrapper.findElementByText("Label", SearchOptions.exact);
                } catch(e) {
                    done();
                }
            })();
        });
    });

    describe("with else template", async () => {
        let ifButton: ExtendedUIElement;
        let elseButton: ExtendedUIElement;
        let toggle: ExtendedUIElement;

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
                await driverWrapper.findElementByText("NgIfElse", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driverWrapper.findElementByText("ngIfElse", SearchOptions.exact);
        });

        it("should find elements", async () => {
            toggleButton = await driverWrapper.findElementByText("Toggle", SearchOptions.exact);
            ifButton = await driverWrapper.findElementByText("If", SearchOptions.exact);
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driverWrapper.findElementByText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            toggleButton = await toggleButton.refetch();
            await toggleButton.click();

            elseButton = await driverWrapper.findElementByText("Else", SearchOptions.exact);
        });

        it("should detach 'if' template when condition is changed to false", done => {
            driverWrapper.findElementByText("If", SearchOptions.exact)
                .then(_ => { throw new Error("If template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                toggleButton = await toggleButton.refetch();
                await toggleButton.click();
                ifButton = await ifButton.refetch();

                try {
                    await driverWrapper.findElementByText("Else", SearchOptions.exact);
                } catch(e) {
                    done();
                }
            })();
        });
    });

    describe("with then-else template", async () => {
        let thenButton: ExtendedUIElement;
        let elseButton: ExtendedUIElement;
        let toggle: ExtendedUIElement;

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
                await driverWrapper.findElementByText("NgIf Then Else", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driverWrapper.findElementByText("ngIf Then Else", SearchOptions.exact);
        });

        it("should find elements", async () => {
            toggleButton = await driverWrapper.findElementByText("Toggle", SearchOptions.exact);
            thenButton = await driverWrapper.findElementByText("Then", SearchOptions.exact);
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driverWrapper.findElementByText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            toggleButton = await toggleButton.refetch();
            await toggleButton.click();

            elseButton = await driverWrapper.findElementByText("Else", SearchOptions.exact);
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driverWrapper.findElementByText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                toggleButton = await toggleButton.refetch();
                await toggleButton.click();
                thenButton = await thenButton.refetch();

                try {
                    await driverWrapper.findElementByText("Else", SearchOptions.exact);
                } catch(e) {
                    done();
                }
            })();
        });
    });

    describe("then-else templates inside content view", async () => {
        let thenButton: ExtendedUIElement;
        let elseButton: ExtendedUIElement;
        let toggle: ExtendedUIElement;

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
                await driverWrapper.findElementByText("Content view", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driverWrapper.findElementByText("Content View", SearchOptions.exact);
        });

        it("should find elements", async () => {
            toggleButton = await driverWrapper.findElementByText("Toggle", SearchOptions.exact);
            thenButton = await driverWrapper.findElementByText("Then", SearchOptions.exact);
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driverWrapper.findElementByText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            toggleButton = await toggleButton.refetch();
            await toggleButton.click();

            elseButton = await driverWrapper.findElementByText("Else", SearchOptions.exact);
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driverWrapper.findElementByText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });
        
        it("should swap the content when condition is changed", done => {
            (async () => {
                toggleButton = await toggleButton.refetch();
                await toggleButton.click();
                thenButton = await thenButton.refetch();

                try {
                    await driverWrapper.findElementByText("Else", SearchOptions.exact);
                } catch(e) {
                    done();
                }
            })();
        });
    });
});
