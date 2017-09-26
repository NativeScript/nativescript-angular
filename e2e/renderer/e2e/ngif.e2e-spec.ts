import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";

import { assert } from "chai";

describe("ngIf scenario", () => {
    let driver: AppiumDriver;
    let toggleButton: UIElement;

    describe("without layout", async () => {
        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("NgIf no layout", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driver.findElementByText("ngIf - no layout", SearchOptions.exact);
        });

        it("should find elements", async () => {
            await driver.findElementByText("false", SearchOptions.exact);
            toggleButton = await driver.findElementByText("Toggle", SearchOptions.exact);
        });

        it("show 'true' button when show is true", async () => {
            await toggleButton.click();

            await driver.findElementByText("true", SearchOptions.exact);
        });
    });

    describe("label inbetween", async () => {
        let firstButton: UIElement;
        let secondButton: UIElement;
        let conditionalLabel: UIElement;
        let toggle: UIElement;

        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();            
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("NgIf inbetween", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driver.findElementByText("ngIf - inbetween", SearchOptions.exact);
        });

        it("should find elements", async () => {
            firstButton = await driver.findElementByText("Button 1", SearchOptions.exact);
            secondButton = await driver.findElementByText("Button 2", SearchOptions.exact);
            toggleButton = await driver.findElementByText("Toggle", SearchOptions.exact);

            conditionalLabel = await driver.findElementByText("Label", SearchOptions.exact);
            const labelIsDisplayed = await conditionalLabel.isDisplayed();
            assert.isTrue(labelIsDisplayed);
        });

        it("detach label when condition is false", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByText("Label", SearchOptions.exact);
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("with else template", async () => {
        let ifButton: UIElement;
        let elseButton: UIElement;
        let toggle: UIElement;

        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();            
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("NgIfElse", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driver.findElementByText("ngIfElse", SearchOptions.exact);
        });

        it("should find elements", async () => {
            toggleButton = await driver.findElementByText("Toggle", SearchOptions.exact);
            ifButton = await driver.findElementByText("If", SearchOptions.exact);
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            await toggleButton.click();

            elseButton = await driver.findElementByText("Else", SearchOptions.exact);
        });

        it("should detach 'if' template when condition is changed to false", done => {
            driver.findElementByText("If", SearchOptions.exact)
                .then(_ => { throw new Error("If template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByText("Else", SearchOptions.exact);
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("with then-else template", async () => {
        let thenButton: UIElement;
        let elseButton: UIElement;
        let toggle: UIElement;

        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();            
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("NgIf Then Else", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driver.findElementByText("ngIf Then Else", SearchOptions.exact);
        });

        it("should find elements", async () => {
            toggleButton = await driver.findElementByText("Toggle", SearchOptions.exact);
            thenButton = await driver.findElementByText("Then", SearchOptions.exact);
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            await toggleButton.click();

            elseButton = await driver.findElementByText("Else", SearchOptions.exact);
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driver.findElementByText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByText("Else", SearchOptions.exact);
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("then-else templates inside content view", async () => {
        let thenButton: UIElement;
        let elseButton: UIElement;
        let toggle: UIElement;

        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();            
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("Content view", SearchOptions.exact);
            await navigationButton.click();

            const actionBar =
                await driver.findElementByText("Content View", SearchOptions.exact);
        });

        it("should find elements", async () => {
            toggleButton = await driver.findElementByText("Toggle", SearchOptions.exact);
            thenButton = await driver.findElementByText("Then", SearchOptions.exact);
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            await toggleButton.click();

            elseButton = await driver.findElementByText("Else", SearchOptions.exact);
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driver.findElementByText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByText("Else", SearchOptions.exact);
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("subsequent ifs", async () => {
        let firstButton: UIElement;
        let secondButton: UIElement;
        let firstLabel: UIElement;
        let secondLabel: UIElement;

        before(async () => {
            driver = await createDriver();
            await driver.driver.resetApp();
        });

        it("should navigate to page", async () => {
            const navigationButton =
                await driver.findElementByText("NgIf Subsequent Ifs", SearchOptions.exact);
            await navigationButton.click();
        });

        it("should find elements", async () => {
            firstButton = await driver.findElementByText("Toggle first", SearchOptions.exact);
            secondButton = await driver.findElementByText("Toggle second", SearchOptions.exact);

            firstLabel = await driver.findElementByText("== 1 ==", SearchOptions.exact);
            secondLabel = await driver.findElementByText("== 2 ==", SearchOptions.exact);

            assert.isDefined(firstButton);
            assert.isDefined(secondButton);
            assert.isDefined(firstLabel);
            assert.isDefined(secondLabel);
        });

        it("should toggle on first view", async () => {
            await firstButton.click();

            let conditional = await driver.findElementByText("first", SearchOptions.exact);

            await isAbove(firstLabel, conditional);
            await isAbove(conditional, secondLabel);
        });

        it("should toggle off first view", done => {
            (async () => {
                await firstButton.click();

                driver.findElementByText("first", SearchOptions.exact, 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => done());
            })();
        });

        it("should toggle on second view", async () => {
            await secondButton.click();

            let conditional = await driver.findElementByText("second", SearchOptions.exact);
            await isAbove(firstLabel, conditional);
            await isAbove(conditional, secondLabel);
        });

        it("should toggle off second view", done => {
            (async () => {
                await secondButton.click();

                driver.findElementByText("first", SearchOptions.exact, 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => done());
            })();
        });

        it("should toggle on both views", async () => {
            await firstButton.click();
            await secondButton.click();

            let conditional1 = await driver.findElementByText("first", SearchOptions.exact);
            let conditional2 = await driver.findElementByText("second", SearchOptions.exact);
            await isAbove(firstLabel, conditional1);
            await isAbove(conditional1, conditional2);
            await isAbove(conditional2, secondLabel);
        });

        it("should toggle off both views", done => {
            (async () => {
                await firstButton.click();
                await secondButton.click();

                driver.findElementByText("first", SearchOptions.exact, 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => {
                        driver.findElementByText("second", SearchOptions.exact, 500)
                            .then(_ => { throw new Error("second label found!"); })
                            .catch(() => done());
                    });
            })();
        });

        it("should toggle on both views in reverse", async () => {
            await secondButton.click();
            await firstButton.click();

            let conditional1 = await driver.findElementByText("first", SearchOptions.exact);
            let conditional2 = await driver.findElementByText("second", SearchOptions.exact);
            await isAbove(firstLabel, conditional1);
            await isAbove(conditional1, conditional2);
            await isAbove(conditional2, secondLabel);
        });

        it("should toggle off both views in reverse", done => {
            (async () => {
                await secondButton.click();
                await firstButton.click();

                driver.findElementByText("first", SearchOptions.exact, 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => {
                        driver.findElementByText("second", SearchOptions.exact, 500)
                            .then(_ => { throw new Error("second label found!"); })
                            .catch(() => done());
                    });
            })();
        });
    });
});
