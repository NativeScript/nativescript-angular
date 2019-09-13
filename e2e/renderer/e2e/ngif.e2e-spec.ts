import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement,
    nsCapabilities
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";

import { assert } from "chai";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.


describe("ngIf scenario", async function () {
    let driver: AppiumDriver;
    let toggleButton: UIElement;

    before(async function () {
        this.timeout(QUEUE_WAIT_TIME);
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.driver.resetApp();
    });

    after(async function () {
        if (isSauceLab) {
            driver.sessionId().then(function (sessionId) {
                console.log("Report https://saucelabs.com/beta/tests/" + sessionId);
            });
        }
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    describe("without layout", async function () {
        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("NgIf no layout");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIf - no layout");
        });

        it("should find elements", async function () {
            await driver.findElementByAutomationText("false");
            toggleButton = await driver.findElementByAutomationText("Toggle");
        });

        it("show 'true' button when show is true", async function () {
            await toggleButton.click();

            await driver.findElementByAutomationText("true");
        });
    });

    describe("label inbetween", async function () {
        let firstButton: UIElement;
        let secondButton: UIElement;
        let conditionalLabel: UIElement;
        let toggle: UIElement;

        before(async function () {
            nsCapabilities.testReporter.context = this;
            await driver.driver.resetApp();
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("NgIf inbetween");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIf - inbetween");
        });

        it("should find elements", async function () {
            firstButton = await driver.findElementByAutomationText("Button 1");
            secondButton = await driver.findElementByAutomationText("Button 2");
            toggleButton = await driver.findElementByAutomationText("Toggle");

            conditionalLabel = await driver.findElementByAutomationText("Label");
            const labelIsDisplayed = await conditionalLabel.isDisplayed();
            assert.isTrue(labelIsDisplayed);
        });

        it("detach label when condition is false", done => {
            (async function () {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Label");
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("with else template", async function () {
        let ifButton: UIElement;
        let elseButton: UIElement;
        let toggle: UIElement;

        before(async function () {
            nsCapabilities.testReporter.context = this;
            await driver.driver.resetApp();
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("NgIfElse");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIfElse");
        });

        it("should find elements", async function () {
            toggleButton = await driver.findElementByAutomationText("Toggle");
            ifButton = await driver.findElementByAutomationText("If");
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByAutomationText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async function () {
            await toggleButton.click();

            elseButton = await driver.findElementByAutomationText("Else");
        });

        it("should detach 'if' template when condition is changed to false", done => {
            driver.findElementByAutomationText("If", SearchOptions.exact)
                .then(_ => { throw new Error("If template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async function () {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Else");
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("with then-else template", async function () {
        let thenButton: UIElement;
        let elseButton: UIElement;
        let toggle: UIElement;

        before(async function () {
            nsCapabilities.testReporter.context = this;
            await driver.driver.resetApp();
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("NgIf Then Else");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("ngIf Then Else");
        });

        it("should find elements", async function () {
            toggleButton = await driver.findElementByAutomationText("Toggle");
            thenButton = await driver.findElementByAutomationText("Then");
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByAutomationText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async function () {
            await toggleButton.click();

            elseButton = await driver.findElementByAutomationText("Else");
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driver.findElementByAutomationText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async function () {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Else");
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("then-else templates inside content view", async function () {
        let thenButton: UIElement;
        let elseButton: UIElement;
        let toggle: UIElement;

        before(async function () {
            nsCapabilities.testReporter.context = this;
            await driver.driver.resetApp();
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("Content view");
            await navigationButton.click();

            const actionBar =
                await driver.findElementByAutomationText("Content View");
        });

        it("should find elements", async function () {
            toggleButton = await driver.findElementByAutomationText("Toggle");
            thenButton = await driver.findElementByAutomationText("Then");
        });

        it("shouldn't render 'else' template when condition is true", done => {
            driver.findElementByAutomationText("Else", SearchOptions.exact)
                .then(_ => { throw new Error("Else template found!"); })
                .catch(() => done());
        });

        it("should attach 'else' template when condition is changed to false", async function () {
            await toggleButton.click();

            elseButton = await driver.findElementByAutomationText("Else");
        });

        it("should detach 'then' template when condition is changed to false", done => {
            driver.findElementByAutomationText("Then", SearchOptions.exact)
                .then(_ => { throw new Error("Then template found!"); })
                .catch(() => done());
        });

        it("should swap the content when condition is changed", done => {
            (async function () {
                await toggleButton.click();

                try {
                    await driver.findElementByAutomationText("Else");
                } catch (e) {
                    done();
                }
            })();
        });
    });

    describe("subsequent ifs", async function () {
        let firstButton: UIElement;
        let secondButton: UIElement;
        let firstLabel: UIElement;
        let secondLabel: UIElement;

        before(async function () {
            nsCapabilities.testReporter.context = this;
            await driver.driver.resetApp();
        });

        it("should navigate to page", async function () {
            const navigationButton =
                await driver.findElementByAutomationText("NgIf Subsequent Ifs");
            await navigationButton.click();
        });

        it("should find elements", async function () {
            firstButton = await driver.findElementByAutomationText("Toggle first");
            secondButton = await driver.findElementByAutomationText("Toggle second");

            firstLabel = await driver.findElementByAutomationText("== 1 ==");
            secondLabel = await driver.findElementByAutomationText("== 2 ==");

            assert.isDefined(firstButton);
            assert.isDefined(secondButton);
            assert.isDefined(firstLabel);
            assert.isDefined(secondLabel);
        });

        it("should toggle on first view", async function () {
            await firstButton.click();

            let conditional = await driver.findElementByAutomationText("first");

            await isAbove(firstLabel, conditional);
            await isAbove(conditional, secondLabel);
        });

        it("should toggle off first view", done => {
            (async function () {
                await firstButton.click();

                driver.findElementsByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => done());
            })();
        });

        it("should toggle on second view", async function () {
            await secondButton.click();

            let conditional = await driver.findElementByAutomationText("second");
            await isAbove(firstLabel, conditional);
            await isAbove(conditional, secondLabel);
        });

        it("should toggle off second view", done => {
            (async function () {
                await secondButton.click();

                driver.findElementByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(() => done());
            })();
        });

        it("should toggle on both views", async function () {
            await firstButton.click();
            await secondButton.click();

            let conditional1 = await driver.findElementByAutomationText("first");
            let conditional2 = await driver.findElementByAutomationText("second");
            await isAbove(firstLabel, conditional1);
            await isAbove(conditional1, conditional2);
            await isAbove(conditional2, secondLabel);
        });

        it("should toggle off both views", done => {
            (async function () {
                await firstButton.click();
                await secondButton.click();

                driver.findElementByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(async function () {
                        driver.findElementByAutomationText("second", 500)
                            .then(_ => { throw new Error("second label found!"); })
                            .catch(() => done());
                    });
            })();
        });

        it("should toggle on both views in reverse", async function () {
            await secondButton.click();
            await firstButton.click();

            let conditional1 = await driver.findElementByAutomationText("first");
            let conditional2 = await driver.findElementByAutomationText("second");
            await isAbove(firstLabel, conditional1);
            await isAbove(conditional1, conditional2);
            await isAbove(conditional2, secondLabel);
        });

        it("should toggle off both views in reverse", done => {
            (async function () {
                await secondButton.click();
                await firstButton.click();

                driver.findElementByAutomationText("first", 500)
                    .then(_ => { throw new Error("first label found!"); })
                    .catch(async function () {
                        driver.findElementByAutomationText("second", 500)
                            .then(_ => { throw new Error("second label found!"); })
                            .catch(() => done());
                    });
            })();
        });
    });
});
