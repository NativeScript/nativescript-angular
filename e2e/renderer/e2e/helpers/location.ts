import { assert } from "chai";
import { UIElement } from "nativescript-dev-appium";

export const isAbove = async (first: UIElement, second: UIElement) => {

    const { y: firstY } = await first.location();
    const { y: secondY } = await second.location();

    assert.isTrue(firstY < secondY);
}

export const isOnTheLeft = async (first: UIElement, second: UIElement) => {

    const { x: firstX } = await first.location();
    const { x: secondX } = await second.location();

    assert.isTrue(firstX < secondX);
}

