import {
    AppiumDriver,
    createDriver,
    SearchOptions,
    UIElement
} from "nativescript-dev-appium";

import { isAbove } from "./helpers/location";

interface ElementTuple {
    label: UIElement,
    button: UIElement,
}

describe("ngForOf scenario", () => {
    let driver: AppiumDriver;
    let addButton: UIElement;
    let removeButton: UIElement;
    let elements: ElementTuple[] = [];
    let lastAddedElementId = 0;

    before(async () => {
        driver = await createDriver();
        await driver.driver.resetApp();
    });

    it("should navigate to page", async () => {
        const navigationButton =
            await driver.findElementByText("NgForOf", SearchOptions.exact);
        await navigationButton.click();

        const actionBar =
            await driver.findElementByText("ngForOf", SearchOptions.exact);
    });

    it("should find elements", async () => {
        const firstElement = await getElement(lastAddedElementId);
        elements.push(firstElement);

        addButton = await driver.findElementByText("add", SearchOptions.exact);
        removeButton = await driver.findElementByText("remove", SearchOptions.exact);

        await elementTupleCorrectlyRendered(firstElement);
        await isAbove(firstElement.button, addButton);
    });

    it("should render elements in correct order", async () => {
        await elementTupleCorrectlyRendered(elements[0]);
        await isAbove(elements[0].button, addButton);
        await isAbove(addButton, removeButton);
    });


    it("should place new elements in the right places", async () => {
        for (let i = 0; i < 2; i += 1) {
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
        const newElement = await getElement(lastAddedElementId);

        elements.push(newElement);
    };

    const removeElement = async (index?: number) => {
        if (index) {
            let { button } = await elements[index];
            await button.click();
        } else {
            index = elements.length - 1;
            await removeButton.click();
        }

        elements.splice(index, 1);
        lastAddedElementId -= 1;
    };

    const checkAppendedCorrectly = async () => {
        const lastAdded = await getElement(lastAddedElementId);

        await elementIsAbove(elements.slice(-2)[0], lastAdded);
        await isAbove(lastAdded.button, addButton);
        await isAbove(addButton, removeButton);
    };

    const checkCorrectOrderAll = async () => {
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
        const label = await driver.findElementByText(
            "label: " + id.toString(), SearchOptions.exact);

        const button = await driver.findElementByText(
            id.toString(), SearchOptions.exact);

        return { label, button };
    };
});

