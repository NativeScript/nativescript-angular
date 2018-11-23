import { AppiumDriver } from "nativescript-dev-appium";
import { assert } from "chai";

const home = "Home Component"
const first = "First"
const modal = "Modal";
const modalFirst = "Modal First";
const dialogConfirm = "Dialog";
const modalSecond = "Modal Second";
const modalNested = "Modal Nested";

const modalFrame = "Show Modal Page With Frame";
const modalNoFrame = "Show Modal Without Frame";
const modalLayout = "Show Modal Layout";
const modalTabView = "Show Modal TabView";
const navToSecondPage = "Navigate To Second Page";
const showDialog = "Show Dialog";
const resetFrameRootView = "Reset Frame Root View";
const resetFrameRootViewModal = "Reset Frame Root View Modal";
const resetNamedFrameRootView = "Reset Named Frame Root View";
const resetNamedFrameRootViewModal = "Reset Named Frame Root View Modal";
const resetTabRootView = "Reset Tab Root View";
const resetTabRootViewModal = "Reset Tab Root View Modal";
const resetLayoutRootView = "Reset Layout Root View";
const resetLayoutRootViewModal = "Reset Layout Root View Modal";

const showNestedModalFrame = "Show Nested Modal Page With Frame";
const showNestedModalPage = "Show Nested Modal Page";

const confirmDialog = "Yes";
const confirmDialogMessage = "Message";
const closeModalNested = "Close Modal Nested";
const closeModal = "Close Modal";
const goBack = "Go Back(activatedRoute)";
export const sharedModalView = "SHARED MODAL VIEW";
export const homeComponent = "Home Component";

export class Screen {

    private _driver: AppiumDriver

    constructor(driver: AppiumDriver) {
        this._driver = driver;
    }

    loadedHome = async () => {
        const lblHome = await this._driver.findElementByAutomationText(home);
        assert.isTrue(await lblHome.isDisplayed());
        console.log(home + " loaded!");
    }

    resetFrameRootView = async () => {
        console.log("Setting frame root ...");
        const btnResetFrameRootView = await this._driver.findElementByAutomationText(resetFrameRootView);
        await btnResetFrameRootView.tap();
    }

    resetNamedFrameRootView = async () => {
        console.log("Setting named frame root ...");
        const btnResetFrameRootView = await this._driver.findElementByAutomationText(resetNamedFrameRootView);
        await btnResetFrameRootView.tap();
    }

    resetLayoutRootView = async () => {
        console.log("Setting layout root ...");
        const btnResetLayoutRootView = await this._driver.waitForElement(resetLayoutRootView);
        await btnResetLayoutRootView.click();
    }

    resetTabRootView = async () => {
        const btnResetTabRootView = await this._driver.findElementByAutomationText(resetTabRootView);
        await btnResetTabRootView.tap();
    }

    resetTabRootViewModal = async () => {
        const btnResetTabRootViewModal = await this._driver.findElementByAutomationText(resetTabRootViewModal);
        await btnResetTabRootViewModal.click();
    }

    resetFrameRootViewModal = async () => {
        const btnResetTabRootViewModal = await this._driver.findElementByAutomationText(resetFrameRootViewModal);
        await btnResetTabRootViewModal.click();
    }

    resetNamedFrameRootViewModal = async () => {
        const btnResetTabRootViewModal = await this._driver.findElementByAutomationText(resetNamedFrameRootViewModal);
        await btnResetTabRootViewModal.click();
    }

    resetLayoutRootViewModal = async () => {
        const btnResetTabRootViewModal = await this._driver.findElementByAutomationText(resetLayoutRootViewModal);
        await btnResetTabRootViewModal.click();
    }

    loadedTabRootView = async () => {
        const tabFirst = await this._driver.findElementByAutomationText(first);
        assert.isTrue(await tabFirst.isDisplayed());
        console.log("Tab root view loaded!");
    }

    setFrameRootView = async () => {
        // should load frame root, no need to verify it is loaded
        await this.loadedHome();
        await this.resetFrameRootView();
    }

    setNamedFrameRootView = async () => {
        // should load named frame root, no need to verify it is loaded
        await this.loadedHome();
        await this.resetNamedFrameRootView();
    }

    setTabRootView = async () => {
        // should load tab root
        await this.loadedHome();
        await this.resetTabRootView();
        await this.loadedTabRootView();
    }

    setLayoutRootView = async () => {
        // should load layout root, no need to verify it is loaded
        await this.loadedHome();
        await this.resetLayoutRootView();
    }

    setTabRootViewModal = async () => {
        await this.loadedHome();
        await this.resetTabRootViewModal();
    }

    setFrameRootViewModal = async () => {
        await this.loadedHome();
        await this.resetFrameRootViewModal();
    }

    setNamedFrameRootViewModal = async () => {
        await this.loadedHome();
        await this.resetNamedFrameRootViewModal();
    }

    setLayoutRootViewModal = async () => {
        await this.loadedHome();
        await this.resetLayoutRootViewModal();
    }

    showModalFrame = async () => {
        const btnModalFrame = await this._driver.findElementByAutomationText(modalFrame);
        await btnModalFrame.tap();
    }

    loadedModalFrame = async () => {
        const lblModal = await this._driver.waitForElement(modal, 5000);
        assert.isTrue(await lblModal.isDisplayed(), `${modal} is not displayed!`);
        console.log(modal + " loaded!");
    }

    showModalNoFrame = async () => {
        const btnModalPage = await this._driver.findElementByAutomationText(modalNoFrame);
        await btnModalPage.tap();
    }


    private showSharedModal = async () => {
        const btnTap = await this._driver.waitForElement("Show Shared Modal");
        await btnTap.click();
    }

    loadedModalPage = async () => {
        const btnShowNestedModalPage = await this._driver.findElementByAutomationText(showNestedModalPage);
        assert.isTrue(await btnShowNestedModalPage.isDisplayed(), `${showNestedModalPage} is not displayed`);
        console.log("Modal Page loaded!");
    }

    showModalLayout = async () => {
        const btnModalLayout = await this._driver.findElementByAutomationText(modalLayout);
        await btnModalLayout.tap();
    }

    loadedModalLayout = async () => {
        await this.loadedModalFrame();
    }

    showModalTabView = async () => {
        const btnModalTabView = await this._driver.findElementByAutomationText(modalTabView);
        await btnModalTabView.tap();
    }

    loadedModalTabView = async () => {
        const itemModalFirst = await this._driver.findElementByAutomationText(modalFirst);
        assert.isTrue(await itemModalFirst.isDisplayed());
        console.log("Modal TabView loaded!");
    }

    navigateToSecondPage = async () => {
        const btnNavToSecondPage = await this._driver.findElementByAutomationText(navToSecondPage);
        await btnNavToSecondPage.tap();
    }

    showDialogConfirm = async () => {
        const btnShowDialogConfirm = await this._driver.findElementByAutomationText(showDialog);
        await btnShowDialogConfirm.tap();
    }

    navigateToFirstItem = async () => {
        const itemModalFirst = await this._driver.findElementByAutomationText(modalFirst);
        await itemModalFirst.tap();
    }

    navigateToSecondItem = async () => {
        const itemModalSecond = await this._driver.findElementByAutomationText(modalSecond);
        await itemModalSecond.tap();
    }

    loadedModalNoFrame = async () => {
        const btnShowDialogConfirm = await this._driver.waitForElement(showDialog);
        const btnCloseModal = await this._driver.waitForElement(closeModal);
        assert.isTrue(await btnShowDialogConfirm.isDisplayed());
        assert.isTrue(await btnCloseModal.isDisplayed());
        console.log("Modal Without Frame shown!");
    }

    loadedConfirmDialog = async () => {
        const lblDialogMessage = await this._driver.findElementByAutomationText(confirmDialogMessage);
        assert.isTrue(await lblDialogMessage.isDisplayed());
        console.log(dialogConfirm + " shown!");
    }

    loadedSecondPage = async () => {
        const lblModalSecond = await this._driver.waitForElement(modalSecond, 5000);
        assert.isTrue(await lblModalSecond.isDisplayed());
        console.log(modalSecond + " loaded!");
    }

    loadedFirstItem = async () => {
        const lblModal = await this._driver.findElementByAutomationText(modal);
        assert.isTrue(await lblModal.isDisplayed());
        console.log("First Item loaded!");
    }

    loadedSecondItem = async () => {
        const btnGoBack = await this._driver.findElementByAutomationText(goBack);
        assert.isTrue(await btnGoBack.isDisplayed());
        console.log("Second Item loaded!");
    }

    closeDialog = async () => {
        const btnYesDialog = await this._driver.findElementByAutomationText(confirmDialog);
        await btnYesDialog.tap();
    }

    goBackFromSecondPage = async () => {
        const btnGoBackFromSecondPage = await this._driver.findElementByAutomationText(goBack);
        await btnGoBackFromSecondPage.tap();
    }

    showNestedModalFrame = async () => {
        const btnShowNestedModalFrame = await this._driver.findElementByAutomationText(showNestedModalFrame);
        await btnShowNestedModalFrame.tap();
    }

    loadedNestedModalFrame = async () => {
        const lblModalNested = await this._driver.waitForElement(modalNested, 5000);
        assert.isTrue(await lblModalNested.isDisplayed());
        console.log(modalNested + " loaded!");
    }

    closeModalNested = async () => {
        const btnCloseNestedModal = await this._driver.findElementByAutomationText(closeModalNested);
        await btnCloseNestedModal.tap();
    }

    showNestedModalPage = async () => {
        const btnShowNestedModalPage = await this._driver.findElementByAutomationText(showNestedModalPage);
        await btnShowNestedModalPage.tap();
    }

    loadedNestedModalPage = async () => {
        const btnCloseModalNested = await this._driver.findElementByAutomationText(closeModalNested);
        assert.isTrue(await btnCloseModalNested.isDisplayed(), `${closeModalNested} is not shown`);
        console.log(closeModalNested + " loaded!");
    }

    closeModal = async () => {
        const btnCloseModal = await this._driver.waitForElement(closeModal, 10000);
        await btnCloseModal.click();
    }

    loadModalNoFrame = async (loadShowModalPageWithFrame: boolean) => {
        if (loadShowModalPageWithFrame) {
            await this.showModalNoFrame();
        }

        await this.loadedModalNoFrame();
    }

    loadModalFrame = async (loadShowModalPageWithFrame: boolean) => {
        if (loadShowModalPageWithFrame) {
            await this.showModalFrame();
        }

        await this.loadedModalFrame();
    }

    loadSharedModal = async (loadShowModalPageWithFrame: boolean) => {
        if (loadShowModalPageWithFrame) {
            await this.showSharedModal();
        }

        const lbl = await this._driver.waitForElement(sharedModalView, 5000);
        assert.isTrue(await lbl.isDisplayed());
    }
}