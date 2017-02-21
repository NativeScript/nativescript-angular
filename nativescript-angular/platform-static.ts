// Always import platform-common first - because polyfills
import {
    NativeScriptPlatformRef,
    AppOptions,
    COMMON_PROVIDERS,
    PlatformFactory
} from "./platform-common";

import { platformCore, PlatformRef, createPlatformFactory } from "@angular/core";

// "Static" platform
const _platformNativeScript: PlatformFactory = createPlatformFactory(
  platformCore, "nativeScript", [...COMMON_PROVIDERS]);

export function platformNativeScript(options?: AppOptions, extraProviders?: any[]): PlatformRef {
  // Return raw platform to advanced users only if explicitly requested
  if (options && options.bootInExistingPage === true) {
    return _platformNativeScript(extraProviders);
  } else {
    return new NativeScriptPlatformRef(_platformNativeScript(extraProviders), options);
  }
}
