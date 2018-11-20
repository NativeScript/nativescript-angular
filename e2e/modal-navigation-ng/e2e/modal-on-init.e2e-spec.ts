import { AppiumDriver, createDriver } from "nativescript-dev-appium";
import { Screen, sharedModalView, homeComponent } from "./screens/screen";
import {
  assertComponent,
  goBack,
  navigateToSecondComponent
} from "./screens/shared-screen";

const roots = [
  "setTabRootViewModal",
  "setFrameRootViewModal",
  "setNamedFrameRootViewModal",
];

describe("modal-on-init:", () => {
  let driver: AppiumDriver;
  let screen: Screen;

  before(async () => {
    driver = await createDriver();
    screen = new Screen(driver);
  });

  after("modal-on-init after all hook", async () => {
    await driver.logTestArtifacts("modal-on-init");
  });

  roots.forEach(root => {
    describe("Shared Modal on Init", () => {
      before(async () => {
        await screen[root]();
        console.log(`Root: ${root}`);
      });

      beforeEach(async function() {});

      afterEach(async function() {
        if (this.currentTest.state === "failed") {
          await driver.logTestArtifacts(this.currentTest.title);
          await driver.resetApp();
          await screen[root]();
        }
      });

      after("root after all hook", async function() {
        await driver.logTestArtifacts(`${root}_root_after_all_hook`);
      });

      it("should shared modal view", async () => {
        await assertComponent(driver, sharedModalView);
      });

      it("run in background", async () => {
        await driver.backgroundApp(1);
        await assertComponent(driver, sharedModalView);
      });

      it("should close shared modal ", async () => {
        await screen.closeModal();
        await screen.loadedHome();
      });

      it("should open/close shared modal", async () => {
        await screen.loadSharedModal(true);
        await screen.closeModal();
        await screen.loadedHome();
      });

      it("should open/close shared modal again", async () => {
        await screen.loadSharedModal(true);
        if (driver.isAndroid) {
            await driver.navBack();
        }else{
            await screen.closeModal();
        }
        await screen.loadedHome();
      });

      it("should open/close modal with frame", async () => {
        await screen.loadModalFrame(true);
        await screen.closeModal();
      });

      it("should open/close shared modal again", async () => {
        await screen.loadSharedModal(true);
        await screen.closeModal();
      });

      it("run in background again", async () => {
        await driver.backgroundApp(1);
        await screen.loadedHome();
      });

      it("should open/close shared modal second", async () => {
          await screen.loadModalFrame(true);
          await screen.closeModal();
      });
    });
  });

  describe("Shared Modal on Init", () => {
    const root = "setLayoutRootViewModal";
    before(async () => {
      await screen[root]();
      console.log(`Root: ${root}`);
    });

    beforeEach(async function() {});

    afterEach(async function() {
      if (this.currentTest.state === "failed") {
        await driver.logTestArtifacts(this.currentTest.title);
        await driver.resetApp();
        await screen[root]();
      }
    });

    after("root after all hook", async function() {
      await driver.logTestArtifacts(`${root}_root_after_all_hook`);
    });

    it("should shared modal view", async () => {
      await assertComponent(driver, sharedModalView);
    });

    it("run in background", async () => {
      await driver.backgroundApp(1);
      await assertComponent(driver, sharedModalView);
    });

    it("should close shared modal ", async () => {
      await screen.closeModal();
      await screen.loadedHome();
    });

    it("should open/close shared modal", async () => {
      await screen.loadModalFrame(true);
      await screen.closeModal();
    });

    it("run in background again", async () => {
      await driver.backgroundApp(1);
      await screen.loadedHome();
    });

    it("should open/close shared modal second", async () => {
        await screen.loadModalFrame(true);
        await screen.closeModal();
    });

    it("should open/close shared modal", async () => {
      await screen.loadSharedModal(true);
      await screen.closeModal();
    });
  });
});
