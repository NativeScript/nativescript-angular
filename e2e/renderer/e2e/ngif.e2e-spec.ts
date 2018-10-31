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
                await driver.findElementByAutomationText("NgIf no layout");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIf - no layout");
        });

        it("should find elements", async () => {
            await driver.findElementByAutomationText("false");
            toggleButton = await driver.findElementByAutomationText("Toggle");
        });

        it("show 'true' button when show is true", async () => {
            await toggleButton.click();

            await driver.findElementByAutomationText("true");
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
                await driver.findElementByAutomationText("NgIf inbetween");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIf - inbetween");
        });

        it("should find elements", async () => {
            firstButton = await driver.findElementByAutomationText("Button 1");
            secondButton = await driver.findElementByAutomationText("Button 2");
            toggleButton = await driver.findElementByAutomationText("Toggle");

            conditionalLabel = await driver.findElementByAutomationText("Label");
            const labelIsDisplayed = await conditionalLabel.isDisplayed();
            assert.isTrue(labelIsDisplayed);
        });

        it("detach label when condition is false", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Label");
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
                await driver.findElementByAutomationText("NgIfElse");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIfElse");
        });

        it("should find elements", async () => {
            toggleButton = await driver.findElementByAutomationText("Toggle");
            ifButton = await driver.findElementByAutomationText("If");
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByAutomationText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            await toggleButton.click();

            elseButton = await driver.findElementByAutomationText("Else");
        });

        it("should detach 'if' template when condition is changed to false", done => {
            driver.findElementByAutomationText("If", SearchOptions.exact)
                .then(_ => { throw new Error("If template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Else");
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
                await driver.findElementByAutomationText("NgIf Then Else");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIf Then Else");
        });

        it("should find elements", async () => {
            toggleButton = await driver.findElementByAutomationText("Toggle");
            thenButton = await driver.findElementByAutomationText("Then");
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByAutomationText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            await toggleButton.click();

            elseButton = await driver.findElementByAutomationText("Else");
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driver.findElementByAutomationText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Else");
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
                await driver.findElementByAutomationText("Content view");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("Content View");
        });

        it("should find elements", async () => {
            toggleButton = await driver.findElementByAutomationText("Toggle");
            thenButton = await driver.findElementByAutomationText("Then");
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByAutomationText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async () => {
            await toggleButton.click();

            elseButton = await driver.findElementByAutomationText("Else");
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driver.findElementByAutomationText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async () => {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Else");
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
                await driver.findElementByAutomationText("NgIf Subsequent Ifs");
            await navigationButton.click();
        });

        it("should find elements", async () => {
            firstButton = await driver.findElementByAutomationText("Toggle first");
            secondButton = await driver.findElementByAutomationText("Toggle second");

            firstLabel = await driver.findElementByAutomationText("== 1 ==");
            secondLabel = await driver.findElementByAutomationText("== 2 ==");

            assert.isDefined(firstButton);
            assert.isDefined(secondButton);
            assert.isDefined(firstLabel);
            assert.isDefined(secondLabel);
        });

        it("should toggle on first view", async () => {
            await firstButton.click();

            let conditional = await driver.findElementByAutomationText("first");

            await isAbove(firstLabel, conditional);
            await isAbove(conditional, secondLabel);
        });

        it("should toggle off first view", done => {
            (async () => {
                await firstButton.click();

                driver.findElementsByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => done());
            })();
        });

        it("should toggle on second view", async () => {
            await secondButton.click();

            let conditional = await driver.findElementByAutomationText("second");
            await isAbove(firstLabel, conditional);
            await isAbove(conditional, secondLabel);
        });

        it("should toggle off second view", done => {
            (async () => {
                await secondButton.click();

                driver.findElementByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => done());
            })();
        });

        it("should toggle on both views", async () => {
            await firstButton.click();
            await secondButton.click();

            let conditional1 = await driver.findElementByAutomationText("first");
            let conditional2 = await driver.findElementByAutomationText("second");
            await isAbove(firstLabel, conditional1);
            await isAbove(conditional1, conditional2);
            await isAbove(conditional2, secondLabel);
        });

        it("should toggle off both views", done => {
            (async () => {
                await firstButton.click();
                await secondButton.click();

                driver.findElementByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => {
                        driver.findElementByAutomationText("second", 500)
                            .then(_ => { throw new Error("second label found!"); })
                            .catch(() => done());
                    });
            })();
        });

        it("should toggle on both views in reverse", async () => {
            await secondButton.click();
            await firstButton.click();

            let conditional1 = await driver.findElementByAutomationText("first");
            let conditional2 = await driver.findElementByAutomationText("second");
            await isAbove(firstLabel, conditional1);
            await isAbove(conditional1, conditional2);
            await isAbove(conditional2, secondLabel);
        });

        it("should toggle off both views in reverse", done => {
            (async () => {
                await secondButton.click();
                await firstButton.click();

                driver.findElementByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => {
                        driver.findElementByAutomationText("second", 500)
                            .then(_ => { throw new Error("second label found!"); })
                            .catch(() => done());
                    });
            })();
        });
    });
});
