// Initial imports and polyfills
import '@nativescript/core';
import '@nativescript/zone-js';
import './dom-adapter';
import 'nativescript-intl';
// TODO: migrate to standard zone.js if possible
// investigate Ivy with templated-items-comp to allow standard zone below to be used instead of patched {N} zone above
// import 'zone.js/dist/zone';
// import "./polyfills/array";
import './polyfills/console';

export * from './platform-common';
export * from './platform-providers';
export * from './platform';
export * from './resource-loader';

export * from './nativescript.module';
export * from './common';

export { NativeScriptAnimationsModule } from './animations';
export * from './file-system';
export * from './http-client';
export * from './forms';
export * from './directives';
export * from './router';
export * from './frame.service';
export { NativeScriptDebug } from './trace';

export { NativeScriptRenderer } from './renderer';
export { EmulatedRenderer } from './renderer-emulated';
export { NativeScriptRendererFactory } from './renderer-factory';
export { ViewClass, ViewClassMeta, ViewResolver, getViewClass, getViewMeta, isKnownView, registerElement, NgView, CommentNode, getSingleViewRecursive } from './element-registry';
