import {
    AppiumDriver,
    createDriver,
    SearchOptions,
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";
import { DriverWrapper, ExtendedUIElement } from "./helpers/appium-elements";

describe("ngFor scenario", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;
    let addButton: ExtendedUIElement;
    let removeButton: ExtendedUIElement;
    let elements: ExtendedUIElement[] = [];
    let lastAddedElementId = 0;

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
            await driverWrapper.findElementByText("NgFor", SearchOptions.exact);
        await navigationButton.click();

        const actionBar =
            await driverWrapper.findElementByText("ngFor", SearchOptions.exact);
    });

    it("should find elements", async () => {
        const first = await driverWrapper.findElementByText(
            lastAddedElementId.toString(), SearchOptions.exact);
        elements.push(first);

        addButton = await driverWrapper.findElementByText("add", SearchOptions.exact);
        removeButton = await driverWrapper.findElementByText("remove", SearchOptions.exact);

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
        addButton = await addButton.refetch();
        await addButton.click();

        lastAddedElementId += 1;
        const newElement = await driverWrapper.findElementByText(
            lastAddedElementId.toString(), SearchOptions.exact);

        elements.push(newElement);
    };

    const removeElement = async (index?: number) => {
        index;
        if (index) {
            let element = await elements[index];
            element = await element.refetch();
            await element.click();
        } else {
            index = elements.length - 1;
            removeButton = await removeButton.refetch();
            await removeButton.click();
        }

        elements.splice(index, 1);
        lastAddedElementId -= 1;
    };

    const checkAppendedCorrectly = async () => {
        const lastAdded = await driverWrapper.findElementByText(
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