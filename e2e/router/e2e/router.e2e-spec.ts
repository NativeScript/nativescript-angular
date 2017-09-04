import {
    AppiumDriver,
    createDriver,
    SearchOptions,
} from "nativescript-dev-appium";

import { DriverWrapper, ExtendedUIElement } from "./helpers/appium-elements";

describe("Simple navigate and back", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;

    before(async () => {
        driver = await createDriver();
        driverWrapper = new DriverWrapper(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    it("should find First", async () => {
        await assureFirstComponent(driverWrapper);
    });

    it("should navigate to Second(1)/master", async () => {
        await goFromFirstToSecond(driverWrapper);

        await assureSecondComponent(driverWrapper, 1);
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate back to First", async () => {
        await goBack(driverWrapper);
        await assureFirstComponent(driverWrapper);
    });
});

describe("Navigate inside nested outlet", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;

    before(async () => {
        driver = await createDriver();
        driverWrapper = new DriverWrapper(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    it("should find First", async () => {
        await assureFirstComponent(driverWrapper);
    });

    it("should navigate to Second(1)/master", async () => {
        await goFromFirstToSecond(driverWrapper);

        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate to Second(1)/detail(1) and back", async () => {
        const detailBtn = await driverWrapper.findElementByText("DETAIL 1", SearchOptions.exact);
        detailBtn.click();
        await assureSecondComponent(driverWrapper, 1)
        await assureNestedDetailComponent(driverWrapper, 1);

        await goBack(driverWrapper);
        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate to Second(1)/detail(2) and back", async () => {
        const detailBtn = await driverWrapper.findElementByText("DETAIL 2", SearchOptions.exact);
        detailBtn.click();
        await assureSecondComponent(driverWrapper, 1)
        await assureNestedDetailComponent(driverWrapper, 2);

        await goBack(driverWrapper);
        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate back to First", async () => {
        await goBack(driverWrapper);
        await assureFirstComponent(driverWrapper);
    });
});

describe("Navigate to same component with different param", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;

    before(async () => {
        driver = await createDriver();
        driverWrapper = new DriverWrapper(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    it("should find First", async () => {
        await assureFirstComponent(driverWrapper);
    });

    it("should navigate to Second(1)/master", async () => {
        await goFromFirstToSecond(driverWrapper);

        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate to Second(2)/master", async () => {
        const navigationButton =
            await driverWrapper.findElementByText("GO TO NEXT SECOND", SearchOptions.exact);
        navigationButton.click();

        await assureSecondComponent(driverWrapper, 2)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate back to Second(1)/master", async () => {
        await goBack(driverWrapper);

        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate back to First", async () => {
        await goBack(driverWrapper);
        await assureFirstComponent(driverWrapper);
    });
});

describe("Nested navigation + page navigation", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;

    before(async () => {
        driver = await createDriver();
        driverWrapper = new DriverWrapper(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    it("should find First", async () => {
        await assureFirstComponent(driverWrapper);
    });

    it("should navigate to Second(1)/master", async () => {
        await goFromFirstToSecond(driverWrapper);

        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate to Second(1)/detail(1)", async () => {
        const detailBtn = await driverWrapper.findElementByText("DETAIL 1", SearchOptions.exact);
        detailBtn.click();

        await assureSecondComponent(driverWrapper, 1)
        await assureNestedDetailComponent(driverWrapper, 1);
    });

    it("should navigate to Second(2)/master", async () => {
        const navigationButton =
            await driverWrapper.findElementByText("GO TO NEXT SECOND", SearchOptions.exact);
        navigationButton.click();

        await assureSecondComponent(driverWrapper, 2)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate to Second(2)/detail(2)", async () => {
        const detailBtn = await driverWrapper.findElementByText("DETAIL 2", SearchOptions.exact);
        detailBtn.click();

        await assureSecondComponent(driverWrapper, 2)
        await assureNestedDetailComponent(driverWrapper, 2);
    });

    it("should navigate to First", async () => {
        const navigationButton =
            await driverWrapper.findElementByText("GO TO FIRST", SearchOptions.exact);
        navigationButton.click();

        await assureFirstComponent(driverWrapper);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driverWrapper);
        await assureSecondComponent(driverWrapper, 2)
        await assureNestedDetailComponent(driverWrapper, 2);

        await goBack(driverWrapper);
        await assureSecondComponent(driverWrapper, 2)
        await assureNestedMasterComponent(driverWrapper);

        await goBack(driverWrapper);
        await assureSecondComponent(driverWrapper, 1)
        await assureNestedDetailComponent(driverWrapper, 1);

        await goBack(driverWrapper);
        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);

        await goBack(driverWrapper);
        await assureFirstComponent(driverWrapper);
    });
});

describe("Shouldn't be able to navigate back on startup", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;

    before(async () => {
        driver = await createDriver();
        driverWrapper = new DriverWrapper(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    it("should find First", async () => {
        await assureFirstComponent(driverWrapper);
    });

    it("shouldn't be able to go back", async () => {
        await goBack(driverWrapper);
        await driverWrapper.findElementByText("canGoBack() - false", SearchOptions.exact);
    });
});

describe("Shouldn't be able to navigate back after cleared history", () => {
    let driver: AppiumDriver;
    let driverWrapper: DriverWrapper;

    before(async () => {
        driver = await createDriver();
        driverWrapper = new DriverWrapper(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Driver quits!");
    });

    it("should find First", async () => {
        await assureFirstComponent(driverWrapper);
    });

    it("should navigate to Second(1)/master", async () => {
        await goFromFirstToSecond(driverWrapper);

        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate to Second(1)/master", async () => {
        const navigationButton =
            await driverWrapper.findElementByText("GO TO FIRST(CLEAR)", SearchOptions.exact);
        navigationButton.click();
        await assureFirstComponent(driverWrapper);
    });

    it("shouldn't be able to go back", async () => {
        await goBack(driverWrapper);
        await driverWrapper.findElementByText("canGoBack() - false", SearchOptions.exact);
    });
});

async function assureFirstComponent(driverWrapper: DriverWrapper) {
    await driverWrapper.findElementByText("FirstComponent", SearchOptions.exact);
}

async function assureSecondComponent(driverWrapper: DriverWrapper, param: number) {
    await driverWrapper.findElementByText("SecondComponent", SearchOptions.exact);
    await driverWrapper.findElementByText(`param: ${param}`, SearchOptions.exact);
}

async function assureNestedMasterComponent(driverWrapper: DriverWrapper) {
    await driverWrapper.findElementByText("NestedMaster", SearchOptions.exact);
}

async function assureNestedDetailComponent(driverWrapper: DriverWrapper, param: number) {
    await driverWrapper.findElementByText("NestedDetail", SearchOptions.exact);
    await driverWrapper.findElementByText(`nested-param: ${param}`, SearchOptions.exact);
}

async function goBack(driverWrapper: DriverWrapper) {
    const backButton = await driverWrapper.findElementByText("BACK", SearchOptions.exact);
    await backButton.click();
}

async function goFromFirstToSecond(driverWrapper: DriverWrapper) {
    const navigationButton =
        await driverWrapper.findElementByText("GO TO SECOND", SearchOptions.exact);
    navigationButton.click();
}