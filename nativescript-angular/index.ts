import "tns-core-modules/application";

export * from "./platform-common";
export * from "./platform";
export * from "./platform-static";
export * from "./platform-providers";
export * from "./resource-loader";

export * from "./nativescript.module";
export * from "./common";

export {
    ViewClass,
    ViewClassMeta,
    ViewResolver,
    getViewClass,
    getViewMeta,
    isKnownView,
    registerElement,
} from "./element-registry";
