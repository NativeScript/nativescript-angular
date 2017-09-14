import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";

describe("ngFor scenario", () => {
    let driver: AppiumDriver;
    let addButton: UIElement;
    let removeButton: UIElement;
    let elements: UIElement[] = [];
    let lastAddedElementId = 0;

    before(async () => {
        driver = await createDriver();
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logScreenshoot(this.currentTest.title);
        }
    });

    it("should navigate to page", async () => {
        const navigationButton =
            await driver.findElementByText("NgFor", SearchOptions.exact);
        await navigationButton.click();

        const actionBar =
            await driver.findElementByText("ngFor", SearchOptions.exact);
    });

    it("should find elements", async () => {
        const first = await driver.findElementByText(
            lastAddedElementId.toString(), SearchOptions.exact);
        elements.push(first);

        addButton = await driver.findElementByText("add", SearchOptions.exact);
        removeButton = await driver.findElementByText("remove", SearchOptions.exact);

        await isAbove(first, addButton);
    });

    it("should render elements in correct order", async () => {
        await isAbove(elements[0], addButton);
        await isAbove(addButton, removeButton);
    });

    it("should place new elements in the right places", async () => {
        for (let i = 0; i < 5; i += 1) {
            await addElement();
            await checkAppendedCorrectly();
        }
    });

    it("shouldn't reorder elements when last is removed", async () => {
        while (elements.length) {
            await removeElement();
            await checkCorrectOrderAll();
        }
    });

    it("should render new elements correctly after all old ones are removed", async () => {
        for (let i = 0; i < 5; i += 1) {
            await addElement();
            await checkCorrectOrderAll();
        }
    });

    it("shouldn't reorder elements when middle is removed", async () => {
        const middleIndex = Math.floor(elements.length / 2);
        await removeElement(middleIndex);
        await checkCorrectOrderAll();
    });

    const addElement = async () => {
        await addButton.click();

        lastAddedElementId += 1;
        const newElement = await driver.findElementByText(
            lastAddedElementId.toString(), SearchOptions.exact);

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

    const checkAppendedCorrectly = async () => {
        const lastAdded = await driver.findElementByText(
            lastAddedElementId.toString(), SearchOptions.exact);

        await isAbove(elements.slice(-2)[0], lastAdded);
        await isAbove(lastAdded, addButton);
        await isAbove(addButton, removeButton);
    };

    const checkCorrectOrderAll = async () => {
        for (let i = 0; i < elements.length - 1; i += 1) {
            await isAbove(elements[i], elements[i + 1]);
        }

        if (elements.length) {
            await isAbove(elements.slice(-1)[0], addButton);
        }
        await isAbove(addButton, removeButton);
    };
});