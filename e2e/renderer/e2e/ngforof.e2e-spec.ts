import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement,
    nsCapabilities
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";
import { isSauceLab } from "nativescript-dev-appium/lib/parser";

const QUEUE_WAIT_TIME: number = 600000; // Sometimes SauceLabs threads are not available and the tests wait in a queue to start. Wait 10 min before timeout.

interface ElementTuple {
    label: UIElement,
    button: UIElement,
}

describe("ngForOf scenario", function () {
    this.retries(2);
    let driver: AppiumDriver;
    let addButton: UIElement;
    let removeButton: UIElement;
    let elements: ElementTuple[] = [];
    let lastAddedElementId = 0;

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

    it("should navigate to page", async function () {
        const navigationButton =
            await driver.findElementByAutomationText("NgForOf");
        await navigationButton.click();

        const actionBar =
            await driver.findElementByAutomationText("ngForOf");
    });

    it("should find elements", async function () {
        const firstElement = await getElement(lastAddedElementId);
        elements.push(firstElement);

        addButton = await driver.findElementByAutomationText("add");
        removeButton = await driver.findElementByAutomationText("remove");

        await elementTupleCorrectlyRendered(firstElement);
        await isAbove(firstElement.button, addButton);
    });

    it("should render elements in correct order", async function () {
        await elementTupleCorrectlyRendered(elements[0]);
        await isAbove(elements[0].button, addButton);
        await isAbove(addButton, removeButton);
    });


    it("should place new elements in the right places", async function () {
        for (let i = 0; i < 2; i += 1) {
            await addElement();
            await checkAppendedCorrectly();
        }
    });

    it("shouldn't reorder elements when last is removed", async function () {
        while (elements.length) {
            await removeElement();
            await checkCorrectOrderAll();
        }
    });

    it("should render new elements correctly after all old ones are removed", async function () {
        for (let i = 0; i < 3; i += 1) {
            await addElement();
            await checkCorrectOrderAll();
        }
    });

    it("shouldn't reorder elements when middle is removed", async function () {
        const middleIndex = Math.floor(elements.length / 2);
        await removeElement(middleIndex);
        await checkCorrectOrderAll();
    });


    const addElement = async function () {
        await addButton.click();

        lastAddedElementId += 1;
        const newElement = await getElement(lastAddedElementId);

        elements.push(newElement);
    };

    const removeElement = async (index?: number) => {
        if (index) {
            let { button } = await elements[index];
            await button.click();
        } else {
            index = elements.length - 1;
            if (driver.platformName.toLowerCase().includes("ios")) {
                await removeButton.tap();
            } else {
                await removeButton.click();
            }
        }

        elements.splice(index, 1);
        lastAddedElementId -= 1;
    };

    const checkAppendedCorrectly = async function () {
        const lastAdded = await getElement(lastAddedElementId);

        await elementIsAbove(elements.slice(-2)[0], lastAdded);
        await isAbove(lastAdded.button, addButton);
        await isAbove(addButton, removeButton);
    };

    const checkCorrectOrderAll = async function () {
        for (let i = 0; i < elements.length - 1; i += 1) {
            await elementIsAbove(elements[i], elements[i + 1]);
        }

        if (elements.length) {
            const last = elements.slice(-1)[0];
            await elementTupleCorrectlyRendered(last);
            await isAbove(last.button, addButton);
        }

        await isAbove(addButton, removeButton);
    };

    const elementIsAbove = async (first: ElementTuple, second: ElementTuple) => {
        await elementTupleCorrectlyRendered(first);
        await elementTupleCorrectlyRendered(second);

        await isAbove(first.button, second.label);
    };

    const elementTupleCorrectlyRendered = async (element: ElementTuple) => {
        await isAbove(element.label, element.button);
    };

    const getElement = async (id: number) => {
        let label = null;
        let button = null;

        if (driver.platformName.toLowerCase().includes("ios")) {
            label = await driver.findElementByAccessibilityId(
                "label: " + id.toString());

            button = await driver.findElementByAccessibilityId(
                id.toString());
        } else {
            label = await driver.findElementByAutomationText(
                "label: " + id.toString());

            button = await driver.findElementByAutomationText(
                id.toString());
        }

        return { label, button };
    };
});

