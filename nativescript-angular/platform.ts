// Always import platform-common first - because polyfills
import {
    NativeScriptPlatformRef,
    AppOptions,
    PlatformFactory,
    COMMON_PROVIDERS
} from "./platform-common";

import {
    ElementSchemaRegistry,
    ResourceLoader,
    COMPILER_PROVIDERS,
    platformCoreDynamic
} from "@angular/compiler";

import {
    COMPILER_OPTIONS,
    PlatformRef,
    InjectionToken,
    ViewEncapsulation,
    createPlatformFactory
} from "@angular/core";

// Work around a TS bug requiring an imports of InjectionToken and ViewEncapsulation without using them
if ((<any>global).___TS_UNUSED) {
    (() => InjectionToken)();
    (() => ViewEncapsulation)();
}

// Register DOM adapter, if possible. Dynamic platform only!
import "./dom-adapter";

import { NativeScriptElementSchemaRegistry } from "./schema-registry";
import { FileSystemResourceLoader } from "./resource-loader";

export const NS_COMPILER_PROVIDERS = [
    COMPILER_PROVIDERS,
    {
        provide: COMPILER_OPTIONS,
        useValue: {
            providers: [
                { provide: ResourceLoader, useClass: FileSystemResourceLoader },
                { provide: ElementSchemaRegistry, useClass: NativeScriptElementSchemaRegistry },
            ]
        },
        multi: true
    },
];

// Dynamic platform
const _platformNativeScriptDynamic: PlatformFactory = createPlatformFactory(
    platformCoreDynamic, "nativeScriptDynamic", [...COMMON_PROVIDERS, ...NS_COMPILER_PROVIDERS]);

export function platformNativeScriptDynamic(
    options?: AppOptions,
    extraProviders?: any[]
): PlatformRef {
    // Return raw platform to advanced users only if explicitly requested
    if (options && options.bootInExistingPage === true) {
        return _platformNativeScriptDynamic(extraProviders);
    } else {
        return new NativeScriptPlatformRef(_platformNativeScriptDynamic(extraProviders), options);
    }
}
