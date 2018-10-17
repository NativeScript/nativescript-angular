import {
    AppiumDriver,
    UIElement,
    createDriver,
    SearchOptions,
} from "nativescript-dev-appium";

describe("Simple navigate and back", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1);
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to First", async () => {
        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate inside nested outlet", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/detail(1) and back", async () => {
        const detailBtn = await driver.findElementByText("DETAIL 1", SearchOptions.exact);
        detailBtn.click();
        await assureSecondComponent(driver, 1)
        await assureNestedDetailComponent(driver, 1);

        await goBack(driver);
        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/detail(2) and back", async () => {
        const detailBtn = await driver.findElementByText("DETAIL 2", SearchOptions.exact);
        detailBtn.click();
        await assureSecondComponent(driver, 1)
        await assureNestedDetailComponent(driver, 2);

        await goBack(driver);
        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to First", async () => {
        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate to same component with different param", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(2)/master", async () => {
        const navigationButton =
            await driver.findElementByText("GO TO NEXT SECOND", SearchOptions.exact);
        navigationButton.click();

        await assureSecondComponent(driver, 2)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to Second(1)/master", async () => {
        await goBack(driver);

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to First", async () => {
        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Nested navigation + page navigation", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/detail(1)", async () => {
        const detailBtn = await driver.findElementByText("DETAIL 1", SearchOptions.exact);
        detailBtn.click();

        await assureSecondComponent(driver, 1)
        await assureNestedDetailComponent(driver, 1);
    });

    it("should navigate to Second(2)/master", async () => {
        const navigationButton =
            await driver.findElementByText("GO TO NEXT SECOND", SearchOptions.exact);
        navigationButton.click();

        await assureSecondComponent(driver, 2)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(2)/detail(2)", async () => {
        const detailBtn = await driver.findElementByText("DETAIL 2", SearchOptions.exact);
        detailBtn.click();

        await assureSecondComponent(driver, 2)
        await assureNestedDetailComponent(driver, 2);
    });

    it("should navigate to First", async () => {
        await findAndClick(driver, "GO TO FIRST");

        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driver);
        await assureSecondComponent(driver, 2)
        await assureNestedDetailComponent(driver, 2);

        await goBack(driver);
        await assureSecondComponent(driver, 2)
        await assureNestedMasterComponent(driver);

        await goBack(driver);
        await assureSecondComponent(driver, 1)
        await assureNestedDetailComponent(driver, 1);

        await goBack(driver);
        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);

        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Nested name navigation + page navigation", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should load nested named Master", async () => {
        await findAndClick(driver, "LOAD NESTED NAMED OUTLET");
        await assureNamedNestedMasterComponent(driver);
    });

    it("should navigate to nested named Master Detail/1", async () => {
        const navigationButton =
            await driver.findElementByText("DETAIL-NAMED 1", SearchOptions.exact);
        navigationButton.click();

        await assureNamedNestedDetailComponent(driver, 1);
    });

    it("should navigate back to Master and navigate to Detail/2", async () => {
        let navigationButton =
            await driver.findElementByText("BACK-NESTED", SearchOptions.exact);
        navigationButton.click();

        await assureNamedNestedMasterComponent(driver);

        navigationButton =
            await driver.findElementByText("DETAIL-NAMED 2", SearchOptions.exact);
        navigationButton.click();

        await assureNamedNestedDetailComponent(driver, 2);
    });
});

describe("Shouldn't be able to navigate back on startup", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("shouldn't be able to go back", async () => {
        await goBack(driver);
        await driver.findElementByText("canGoBack() - false", SearchOptions.exact);
    });
});

describe("Shouldn't be able to navigate back after cleared history", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO FIRST(CLEAR)");

        await assureFirstComponent(driver);
    });

    it("shouldn't be able to go back", async () => {
        await goBack(driver);
        await driver.findElementByText("canGoBack() - false", SearchOptions.exact);
    });
});

describe("Navigate to componentless route", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to ComponentlessSecond(100)/detail(200)", async () => {
        const navigationButton =
            await driver.findElementByText("GO TO C-LESS SECOND", SearchOptions.exact);
        navigationButton.click();

        await assureSecondComponent(driver, 100)
        await assureNestedDetailComponent(driver, 200);
    });

    it("should navigate to First", async () => {
        await findAndClick(driver, "GO TO FIRST");

        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driver);
        await assureSecondComponent(driver, 100)
        await assureNestedDetailComponent(driver, 200);

        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate to lazy module", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to lazy/home", async () => {
        await findAndClick(driver, "GO TO LAZY HOME");
        await assureLazyComponent(driver);
    });

    it("should navigate to First", async () => {
        await findAndClick(driver, "GO TO FIRST");
        await assureFirstComponent(driver);
    });

    it("should navigate back to lazy/home", async () => {
        await goBack(driver);
        await assureLazyComponent(driver);
    });

    it("should navigate to First again", async () => {
        await findAndClick(driver, "GO TO FIRST");
        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driver);
        await assureLazyComponent(driver);

        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate to componentless lazy module route", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should navigate to nest/more (componentless lazy route)", async () => {
        await findAndClick(driver, "GO TO C-LESS LAZY");

        await assureComponentlessLazyComponent(driver);
    });

    it("should navigate to lazy/home", async () => {
        await findAndClick(driver, "GO TO LAZY HOME");

        await assureLazyComponent(driver);
    });

    it("should navigate to First", async () => {
        await findAndClick(driver, "GO TO FIRST");

        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async () => {
        await goBack(driver);
        await assureLazyComponent(driver);

        await goBack(driver);
        await assureComponentlessLazyComponent(driver);

        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

async function assureFirstComponent(driver: AppiumDriver) {
    await driver.findElementByText("FirstComponent", SearchOptions.exact);
}

async function assureLazyComponent(driver: AppiumDriver) {
    await driver.findElementByText("LazyComponent", SearchOptions.exact);
}

async function assureComponentlessLazyComponent(driver: AppiumDriver) {
    await driver.findElementByText("Lazy Componentless Route", SearchOptions.exact);
}

async function assureNamedNestedMasterComponent(driver: AppiumDriver) {
    await driver.findElementByText("NamedNestedMaster", SearchOptions.exact);
}

async function assureNamedNestedDetailComponent(driver: AppiumDriver, param: number) {
    await driver.findElementByText("NamedNestedDetail", SearchOptions.exact);
    await driver.findElementByText(`nested-named-param: ${param}`, SearchOptions.exact);

}

async function assureSecondComponent(driver: AppiumDriver, param: number) {
    await driver.findElementByText("SecondComponent", SearchOptions.exact);
    await driver.findElementByText(`param: ${param}`, SearchOptions.exact);
}

async function assureNestedMasterComponent(driver: AppiumDriver) {
    await driver.findElementByText("NestedMaster", SearchOptions.exact);
}

async function assureNestedDetailComponent(driver: AppiumDriver, param: number) {
    await driver.findElementByText("NestedDetail", SearchOptions.exact);
    await driver.findElementByText(`nested-param: ${param}`, SearchOptions.exact);
}

async function goBack(driver: AppiumDriver) {
    const backButton = await driver.findElementByText("BACK", SearchOptions.exact);
    await backButton.click();
    //await driver.navBack();
}

async function findAndClick(driver: AppiumDriver, text: string) {
    const navigationButton =
        await driver.findElementByText(text, SearchOptions.exact);
    navigationButton.click();
}