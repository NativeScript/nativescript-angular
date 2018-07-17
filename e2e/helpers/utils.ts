import { UIElement } from "nativescript-dev-appium";

export const sort = async (array: Array<UIElement>) => {
    var done = false;
    while (!done) {
        done = true;
        for (var i = 1; i < array.length; i++) {
            if ((await (await array[i - 1]).location()).y > (await (await array[i]).location()).y) {
                done = false;
                var tmp = array[i - 1];
                array[i - 1] = array[i];
                array[i] = tmp;
            }
        }
    }

    return array;
}