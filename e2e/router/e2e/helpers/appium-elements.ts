import { AppiumDriver } from "nativescript-dev-appium";

import { UIElement } from "nativescript-dev-appium/ui-element";

export class ExtendedUIElement extends UIElement {
    refetch(): Promise<ExtendedUIElement> {
        return Promise.resolve(this);
    } 
}

const refetchable = () =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value; 
        const patchRefetch = async (args, fetchMethod) => {
            const result = await fetchMethod() as ExtendedUIElement;
            result.refetch = () => patchRefetch(args, fetchMethod);

            return result;
        }

        descriptor.value = async function (...args: any[]): Promise<ExtendedUIElement> {
            const fetchMethod = () => originalMethod.apply(this, args);
            const result = await patchRefetch(args, fetchMethod);

            return result;
        }

        return descriptor;
    };

export class DriverWrapper {
    constructor(private driver: AppiumDriver) {
    }

    @refetchable()
    async findElementByText(...args: any[]): Promise<ExtendedUIElement> {
        const result = await (<any>this.driver).findElementByText(...args);

        return result;
    }
}
