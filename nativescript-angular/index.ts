import "tns-core-modules/application";

export * from "./platform-common";
export * from "./platform";
export * from "./platform-static";
export * from "./router";
export * from "./forms";
export * from "./directives";
export * from "./common/detached-loader";
export * from "./trace";
export * from "./platform-providers";
export * from "./file-system/ns-file-system";
export * from "./modal-dialog";
export * from "./renderer";
export * from "./view-util";
export * from "./resource-loader";

export * from "./nativescript.module";
export * from "./platform";

export {
    ViewClass,
    ViewClassMeta,
    ViewResolver,
    getViewClass,
    getViewMeta,
    isKnownView,
    registerElement,
} from "./element-registry";

export * from "./forms/value-accessors/base-value-accessor";
