// Initial imports and polyfills
import "tns-core-modules/globals";

// Require application early to work around a circular import
import "tns-core-modules/application";

// Require zone to patch timers
import "./zone-js/dist/zone-nativescript";
import "./polyfills/array";
import "./polyfills/console";

// This should come last as it import @angular
import "./dom-adapter";
