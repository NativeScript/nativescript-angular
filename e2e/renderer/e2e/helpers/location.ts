import { assert } from "chai";

import { ExtendedUIElement } from "./appium-elements";

export const isAbove = async (first: ExtendedUIElement, second: ExtendedUIElement) => {
    first = await first.refetch();
    second = await second.refetch();

    const { y: firstY } = await first.location();
    const { y: secondY } = await second.location();

    assert.isTrue(firstY < secondY);
}

export const isOnTheLeft = async (first: ExtendedUIElement, second: ExtendedUIElement) => {
    first = await first.refetch();
    second = await second.refetch();

    const { x: firstX } = await first.location();
    const { x: secondX } = await second.location();

    assert.isTrue(firstX < secondX);
}

