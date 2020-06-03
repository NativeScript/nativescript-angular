import "@nativescript/core/application";

export * from "./platform-common";
export * from "./platform";
export * from "./platform-static";
export * from "./platform-providers";
export * from "./resource-loader";

export * from "./nativescript.module";
export * from "./common";

export * from "./animations";
export * from "./router";
export * from "./file-system";
export * from "./http-client";
export * from "./forms";

export {
    ViewClass,
    ViewClassMeta,
    ViewResolver,
    getViewClass,
    getViewMeta,
    isKnownView,
    registerElement,
} from "./element-registry";
