import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement,
    nsCapabilities
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";

describe("ngFor scenario", async function () {
    let driver: AppiumDriver;
    let addButton: UIElement;
    let removeButton: UIElement;
    let elements: UIElement[] = [];
    let lastAddedElementId = 0;

    before(async function () {
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should navigate to page", async function () {
        const navigationButton =
            await driver.findElementByAutomationText("NgFor");
        await navigationButton.click();

        const actionBar =
            await driver.findElementByAutomationText("ngFor");
    });

    it("should find elements", async function () {
        const first = await driver.findElementByAutomationText(
            lastAddedElementId.toString());
        elements.push(first);

        addButton = await driver.findElementByAutomationText("add");
        removeButton = await driver.findElementByAutomationText("remove");

        await isAbove(first, addButton);
    });

    it("should render elements in correct order", async function () {
        await isAbove(elements[0], addButton);
        await isAbove(addButton, removeButton);
    });

    it("should place new elements in the right places", async function () {
        for (let i = 0; i < 3; i += 1) {
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
        const newElement = await driver.findElementByAutomationText(
            lastAddedElementId.toString());

        elements.push(newElement);
    };

    const removeElement = async (index?: number) => {
        index;
        if (index) {
            let element = await elements[index];
            await element.click();
        } else {
            index = elements.length - 1;
            await removeButton.click();
        }

        elements.splice(index, 1);
        lastAddedElementId -= 1;
    };

    const checkAppendedCorrectly = async function () {
        const lastAdded = await driver.findElementByAutomationText(
            lastAddedElementId.toString());

        await isAbove(elements.slice(-2)[0], lastAdded);
        await isAbove(lastAdded, addButton);
        await isAbove(addButton, removeButton);
    };

    const checkCorrectOrderAll = async function () {
        for (let i = 0; i < elements.length - 1; i += 1) {
            await isAbove(elements[i], elements[i + 1]);
        }

        if (elements.length) {
            await isAbove(elements.slice(-1)[0], addButton);
        }
        await isAbove(addButton, removeButton);
    };
});