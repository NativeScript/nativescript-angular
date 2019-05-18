import {
    AppiumDriver,
    UIElement,
    createDriver,
    SearchOptions,
    nsCapabilities,
} from "nativescript-dev-appium";

describe("Simple navigate and back", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1);
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to First", async function(){
        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate inside nested outlet", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/detail(1) and back", async function(){
        const detailBtn = await driver.findElementByAutomationText("DETAIL 1");
        detailBtn.click();
        await assureSecondComponent(driver, 1)
        await assureNestedDetailComponent(driver, 1);

        await goBack(driver);
        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/detail(2) and back", async function(){
        const detailBtn = await driver.findElementByAutomationText("DETAIL 2");
        detailBtn.click();
        await assureSecondComponent(driver, 1)
        await assureNestedDetailComponent(driver, 2);

        await goBack(driver);
        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to First", async function(){
        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate to same component with different param", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(2)/master", async function(){
        const navigationButton =
            await driver.findElementByAutomationText("GO TO NEXT SECOND");
        navigationButton.click();

        await assureSecondComponent(driver, 2)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to Second(1)/master", async function(){
        await goBack(driver);

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to First", async function(){
        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Nested navigation + page navigation", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/detail(1)", async function(){
        const detailBtn = await driver.findElementByAutomationText("DETAIL 1");
        detailBtn.click();

        await assureSecondComponent(driver, 1)
        await assureNestedDetailComponent(driver, 1);
    });

    it("should navigate to Second(2)/master", async function(){
        const navigationButton =
            await driver.findElementByAutomationText("GO TO NEXT SECOND");
        navigationButton.click();

        await assureSecondComponent(driver, 2)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(2)/detail(2)", async function(){
        const detailBtn = await driver.findElementByAutomationText("DETAIL 2");
        detailBtn.click();

        await assureSecondComponent(driver, 2)
        await assureNestedDetailComponent(driver, 2);
    });

    it("should navigate to First", async function(){
        await findAndClick(driver, "GO TO FIRST");

        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async function(){
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

describe("Nested name navigation + page navigation", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should load nested named Master", async function(){
        await findAndClick(driver, "LOAD NESTED NAMED OUTLET");
        await assureNamedNestedMasterComponent(driver);
    });

    it("should navigate to nested named Master Detail/1", async function(){
        const navigationButton =
            await driver.findElementByAutomationText("DETAIL-NAMED 1");
        navigationButton.click();

        await assureNamedNestedDetailComponent(driver, 1);
    });

    it("should navigate back to Master and navigate to Detail/2", async function(){
        let navigationButton =
            await driver.findElementByAutomationText("BACK-NESTED");
        navigationButton.click();

        await assureNamedNestedMasterComponent(driver);

        navigationButton =
            await driver.findElementByAutomationText("DETAIL-NAMED 2");
        navigationButton.click();

        await assureNamedNestedDetailComponent(driver, 2);
    });
});

describe("Shouldn't be able to navigate back on startup", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("shouldn't be able to go back", async function(){
        await goBack(driver);
        await driver.findElementByAutomationText("canGoBack() - false");
    });
});

describe("Shouldn't be able to navigate back after cleared history", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1)
        await assureNestedMasterComponent(driver);
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO FIRST(CLEAR)");

        await assureFirstComponent(driver);
    });

    it("shouldn't be able to go back", async function(){
        await goBack(driver);
        await driver.findElementByAutomationText("canGoBack() - false");
    });
});

describe("Navigate to componentless route", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to ComponentlessSecond(100)/detail(200)", async function(){
        const navigationButton =
            await driver.findElementByAutomationText("GO TO C-LESS SECOND");
        navigationButton.click();

        await assureSecondComponent(driver, 100)
        await assureNestedDetailComponent(driver, 200);
    });

    it("should navigate to First", async function(){
        await findAndClick(driver, "GO TO FIRST");

        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async function(){
        await goBack(driver);
        await assureSecondComponent(driver, 100)
        await assureNestedDetailComponent(driver, 200);

        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate to lazy module", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to lazy/home", async function(){
        await findAndClick(driver, "GO TO LAZY HOME");
        await assureLazyComponent(driver);
    });

    it("should navigate to First", async function(){
        await findAndClick(driver, "GO TO FIRST");
        await assureFirstComponent(driver);
    });

    it("should navigate back to lazy/home", async function(){
        await goBack(driver);
        await assureLazyComponent(driver);
    });

    it("should navigate to First again", async function(){
        await findAndClick(driver, "GO TO FIRST");
        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async function(){
        await goBack(driver);
        await assureLazyComponent(driver);

        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Navigate to componentless lazy module route", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should navigate to nest/more (componentless lazy route)", async function(){
        await findAndClick(driver, "GO TO C-LESS LAZY");

        await assureComponentlessLazyComponent(driver);
    });

    it("should navigate to lazy/home", async function(){
        await findAndClick(driver, "GO TO LAZY HOME");

        await assureLazyComponent(driver);
    });

    it("should navigate to First", async function(){
        await findAndClick(driver, "GO TO FIRST");

        await assureFirstComponent(driver);
    });

    it("should navigate the whole stack", async function(){
        await goBack(driver);
        await assureLazyComponent(driver);

        await goBack(driver);
        await assureComponentlessLazyComponent(driver);

        await goBack(driver);
        await assureFirstComponent(driver);
    });
});

describe("Simple navigate and back should trigger only one CD on FirstComponent", async function(){
    let driver: AppiumDriver;

    before(async function(){
        nsCapabilities.testReporter.context = this;
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should find First", async function(){
        await assureFirstComponent(driver);
    });

    it("should reset counter", async function(){
        await findAndClick(driver, "RESET");
        await driver.waitForElement("CHECK: 1");
    });

    it("should navigate to Second(1)/master", async function(){
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1);
        await assureNestedMasterComponent(driver);
    });

    it("should navigate back to First", async function(){
        await goBack(driver);
        await assureFirstComponent(driver);
        await driver.waitForElement("CHECK: 2");
    });
});

describe("Simple navigate and back should trigger only one CD on FirstComponent even with 3 changes in service", () => {
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        await driver.resetApp();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });
    
    it("should find First", async () => {
        await assureFirstComponent(driver);
    });

    it("should reset counter", async () => {
        await findAndClick(driver, "RESET");
        await driver.waitForElement("CHECK: 1");
        await driver.waitForElement("COUNTER: 0");
    });

    it("should navigate to Second(1)/master", async () => {
        await findAndClick(driver, "GO TO SECOND");

        await assureSecondComponent(driver, 1);
        await assureNestedMasterComponent(driver);
    });

    it("should increase counter", async () => {
        await findAndClick(driver, "TICK");
        await findAndClick(driver, "TICK");
        await findAndClick(driver, "TICK");
    });

    it("should navigate back to First", async () => {
        await goBack(driver);
        await assureFirstComponent(driver);
        await driver.waitForElement("CHECK: 2");
        await driver.waitForElement("COUNTER: 3");
    });
});


async function assureFirstComponent(driver: AppiumDriver) {
    await driver.findElementByAutomationText("FirstComponent");
}

async function assureLazyComponent(driver: AppiumDriver) {
    await driver.findElementByAutomationText("LazyComponent");
}

async function assureComponentlessLazyComponent(driver: AppiumDriver) {
    await driver.findElementByAutomationText("Lazy Componentless Route");
}

async function assureNamedNestedMasterComponent(driver: AppiumDriver) {
    await driver.findElementByAutomationText("NamedNestedMaster");
}

async function assureNamedNestedDetailComponent(driver: AppiumDriver, param: number) {
    await driver.findElementByAutomationText("NamedNestedDetail");
    await driver.findElementByAutomationText(`nested-named-param: ${param}`);

}

async function assureSecondComponent(driver: AppiumDriver, param: number) {
    await driver.findElementByAutomationText("SecondComponent");
    await driver.findElementByAutomationText(`param: ${param}`);
}

async function assureNestedMasterComponent(driver: AppiumDriver) {
    await driver.findElementByAutomationText("NestedMaster");
}

async function assureNestedDetailComponent(driver: AppiumDriver, param: number) {
    await driver.findElementByAutomationText("NestedDetail");
    await driver.findElementByAutomationText(`nested-param: ${param}`);
}

async function goBack(driver: AppiumDriver) {
    const backButton = await driver.waitForElement("BACK");
    await backButton.click();
}

async function findAndClick(driver: AppiumDriver, text: string) {
    const navigationButton = await driver.waitForElement(text);
    await navigationButton.click();
}