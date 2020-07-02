import {
    NativeScriptPlatformRef,
    AppOptions,
    PlatformFactory,
    COMMON_PROVIDERS
} from './platform-common';

// import { NSFileSystem } from "./file-system/ns-file-system";

// import {
//     ElementSchemaRegistry,
//     ResourceLoader,
// } from "@angular/compiler";

// import {
//     ɵplatformCoreDynamic as platformCoreDynamic
// } from "@angular/platform-browser-dynamic";

import {
    COMPILER_OPTIONS,
    PlatformRef,
    InjectionToken,
    ViewEncapsulation,
    createPlatformFactory,
    MissingTranslationStrategy,
    StaticProvider,
} from '@angular/core';

// Work around a TS bug requiring an imports of
// InjectionToken, ViewEncapsulation and MissingTranslationStrategy
// without using them
// if ((<any>global).___TS_UNUSED) {
//     (() => InjectionToken)();
//     (() => ViewEncapsulation)();
//     (() => MissingTranslationStrategy)();
// }

// import { NativeScriptElementSchemaRegistry } from "./schema-registry";
// import { FileSystemResourceLoader } from "./resource-loader";

// export const NS_COMPILER_PROVIDERS: StaticProvider[] = [
//     {
//         provide: COMPILER_OPTIONS,
//         useValue: {
//             providers: [
//                 { provide: NSFileSystem, deps: [] },
//                 { provide: ResourceLoader, useClass: FileSystemResourceLoader, deps: [NSFileSystem] },
//                 { provide: ElementSchemaRegistry, useClass: NativeScriptElementSchemaRegistry, deps: [] },
//             ]
//         },
//         multi: true
//     },
// ];

// // Dynamic platform
// const _platformNativeScriptDynamic: PlatformFactory = createPlatformFactory(
//     platformCoreDynamic, "nativeScriptDynamic", [...COMMON_PROVIDERS, ...NS_COMPILER_PROVIDERS]);

// export function platformNativeScriptDynamic(
//     options?: AppOptions,
//     extraProviders?: any[]
// ): PlatformRef {
//     // Return raw platform to advanced users only if explicitly requested
//     if (options && options.bootInExistingPage === true) {
//         return _platformNativeScriptDynamic(extraProviders);
//     } else {
//         return new NativeScriptPlatformRef(_platformNativeScriptDynamic(extraProviders), options);
//     }
// }


import { platformCore } from '@angular/core';

// "Static" platform
const _platformNativeScript: PlatformFactory = createPlatformFactory(
  platformCore, 'nativeScript', [...COMMON_PROVIDERS]);

export function platformNativeScript(options?: AppOptions, extraProviders?: any[]): PlatformRef {
  // Return raw platform to advanced users only if explicitly requested
  if (options && options.bootInExistingPage === true) {
    return _platformNativeScript(extraProviders);
  } else {
    return new NativeScriptPlatformRef(_platformNativeScript(extraProviders), options);
  }
}

