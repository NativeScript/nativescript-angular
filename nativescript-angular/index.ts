import "tns-core-modules/application";

export * from "./platform-common";
export * from "./platform";
export * from "./platform-static";
export * from "./router";
export * from "./forms";
export * from "./http";
export * from "./directives";
export * from "./common/detached-loader";
export * from "./trace";
export * from "./platform-providers";
export * from "./file-system/ns-file-system";
export * from "./modal-dialog";
export * from "./renderer";
export * from "./view-util";
export * from "./resource-loader";

export {
    ViewResolver,
    registerElement,
    getViewClass,
    getViewMeta,
    isKnownView,
} from "./element-registry";

export {
    ViewClass,
    ViewClassMeta,
} from "./element-types";

export * from "./value-accessors/base-value-accessor";
