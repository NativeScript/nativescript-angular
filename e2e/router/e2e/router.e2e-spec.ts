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
        await findAndClick(driverWrapper, "GO TO SECOND");

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
        await findAndClick(driverWrapper, "GO TO SECOND");

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
        await findAndClick(driverWrapper, "GO TO SECOND");

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
        await findAndClick(driverWrapper, "GO TO SECOND");

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
        await findAndClick(driverWrapper, "GO TO FIRST");

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
        await findAndClick(driverWrapper, "GO TO SECOND");

        await assureSecondComponent(driverWrapper, 1)
        await assureNestedMasterComponent(driverWrapper);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driverWrapper, "GO TO FIRST(CLEAR)");

        await assureFirstComponent(driverWrapper);
    });

    it("shouldn't be able to go back", async () => {
        await goBack(driverWrapper);
        await driverWrapper.findElementByText("canGoBack() - false", SearchOptions.exact);
    });
});

describe("Navigate to componentless route", () => {
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

    it("should navigate to ComponentlessSecond(100)/detail(200)", async () => {
        const navigationButton =
            await driverWrapper.findElementByText("GO TO C-LESS SECOND", SearchOptions.exact);
        navigationButton.click();

        await assureSecondComponent(driverWrapper, 100)
        await assureNestedDetailComponent(driverWrapper, 200);
    });

    it("should navigate to First", async () => {
        await findAndClick(driverWrapper, "GO TO FIRST");

        await assureFirstComponent(driverWrapper);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driverWrapper);
        await assureSecondComponent(driverWrapper, 100)
        await assureNestedDetailComponent(driverWrapper, 200);

        await goBack(driverWrapper);
        await assureFirstComponent(driverWrapper);
    });
});

describe("Navigate to lazy module", () => {
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

    it("should navigate to lazy/home", async () => {
        await findAndClick(driverWrapper, "GO TO LAZY HOME");

        await assureLazyComponent(driverWrapper);
    });

    it("should navigate to First", async () => {
        await findAndClick(driverWrapper, "GO TO FIRST");
        await assureFirstComponent(driverWrapper);
    });

    it("should navigate back to lazy/home", async () => {
        await goBack(driverWrapper);
        await assureLazyComponent(driverWrapper);
    });

    it("should navigate to First again", async () => {
        await findAndClick(driverWrapper, "GO TO FIRST");
        await assureFirstComponent(driverWrapper);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driverWrapper);
        await assureLazyComponent(driverWrapper);

        await goBack(driverWrapper);
        await assureFirstComponent(driverWrapper);
    });
});

describe("Navigate to componentless lazy module route", () => {
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

    it("should navigate to nest/more (componentless lazy route)", async () => {
        await findAndClick(driverWrapper, "GO TO C-LESS LAZY");

        await assureComponentlessLazyComponent(driverWrapper);
    });

    it("should navigate to lazy/home", async () => {
        await findAndClick(driverWrapper, "GO TO LAZY HOME");

        await assureLazyComponent(driverWrapper);
    });
    
    it("should navigate to First", async () => {
        await findAndClick(driverWrapper, "GO TO FIRST");

        await assureFirstComponent(driverWrapper);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driverWrapper);
        await assureLazyComponent(driverWrapper);

        await goBack(driverWrapper);
        await assureComponentlessLazyComponent(driverWrapper);

        await goBack(driverWrapper);
        await assureFirstComponent(driverWrapper);
    });
});

async function assureFirstComponent(driverWrapper: DriverWrapper) {
    await driverWrapper.findElementByText("FirstComponent", SearchOptions.exact);
}

async function assureLazyComponent(driverWrapper: DriverWrapper) {
    await driverWrapper.findElementByText("LazyComponent", SearchOptions.exact);
}

async function assureComponentlessLazyComponent(driverWrapper: DriverWrapper) {
    await driverWrapper.findElementByText("Lazy Componentless Route", SearchOptions.exact);
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

async function findAndClick(driverWrapper: DriverWrapper, text: string) {
    const navigationButton =
        await driverWrapper.findElementByText(text, SearchOptions.exact);
    navigationButton.click();
}