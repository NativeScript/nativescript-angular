// Initial imports and polyfills
import '@nativescript/core';
import '@nativescript/zone-js';
// TODO: migrate to standard zone.js if possible
// investigate Ivy with templated-items-comp to allow standard zone below to be used instead of patched {N} zone above
// import 'zone.js/dist/zone';
import './dom-adapter';
import 'nativescript-intl';
// import "./polyfills/array";
import './polyfills/console';

export * from './platform-common';
export * from './platform-providers';
export * from './platform';
export * from './resource-loader';

export * from './nativescript.module';
export * from './common';
export * from './common/detached-loader';
export * from './common/utils';

export { NativeScriptAnimationsModule } from './animations';
export * from './file-system';
export * from './http-client';
export * from './forms';
export * from './directives';
export * from './router';
export * from './frame.service';

export { NativeScriptRenderer } from './renderer';
export { EmulatedRenderer } from './renderer-emulated';
export { NativeScriptRendererFactory } from './renderer-factory';

// utils
export { NativeScriptDebug } from './trace';
export * from './app-host-view';
export { getViewClass, getViewMeta, isKnownView, registerElement, CommentNode, getSingleViewRecursive, isInvisibleNode, isView } from './element-registry';
export type { NgView, ViewClass, ViewClassMeta, ViewResolver, ViewExtensions } from './element-registry';
