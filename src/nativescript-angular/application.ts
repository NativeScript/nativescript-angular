import {Type} from 'angular2/src/facade/lang';
import {Promise, PromiseWrapper} from 'angular2/src/facade/async';
import {ApplicationRef} from 'angular2/src/core/application';
import {bind, Binding} from 'angular2/di';
import {DOM} from 'angular2/src/dom/dom_adapter';

import {Renderer} from 'angular2/src/render/api';
import {NativeScriptRenderer} from 'nativescript-angular/renderer';
import {Parse5DomAdapter} from 'angular2/src/dom/parse5_adapter';

import {bootstrap as angularBootstrap} from 'angular2/src/core/application';


export type BindingList = List<Type | Binding | List<any>>;

export function nativeScriptBootstrap(appComponentType: Type,
                          componentInjectableBindings: BindingList = null,
                          errorReporter: Function = null): Promise<ApplicationRef> {
  Parse5DomAdapter.makeCurrent();

  let nativeScriptBindings: BindingList = [
      NativeScriptRenderer,
      bind(Renderer).toAlias(NativeScriptRenderer)
  ];
  let augmentedBindings = nativeScriptBindings.concat(componentInjectableBindings);

  return angularBootstrap(appComponentType, augmentedBindings, errorReporter)
}

//TODO: move to a separate file
if (![].fill)  {
  Array.prototype.fill = function(value) {
 
    var O = Object(this);
    var len = parseInt(O.length, 10);
    var start = arguments[1];
    var relativeStart = parseInt(start, 10) || 0;
    var k = relativeStart < 0
            ? Math.max( len + relativeStart, 0) 
            : Math.min( relativeStart, len );
    var end = arguments[2];
    var relativeEnd = end === undefined
                      ? len 
                      : (parseInt( end) || 0) ;
    var final = relativeEnd < 0
                ? Math.max(len + relativeEnd, 0)
                : Math.min(relativeEnd, len);
 
    for (; k < final; k++) {
        O[k] = value;
    }
 
    return O;
  };
}

//if (!(<any>Array).from) {
    //(<any>Array).from = function (object) {
        //'use strict';
        //return [].slice.call(object);
    //};
//}
/*! https://mths.be/array-from v0.2.0 by @mathias */
if (!(<any>Array).from) {
	(function() {
		'use strict';
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements.
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, <string>object, object) && $defineProperty;
			} catch(error) {}
			return result || function put(object, key, descriptor) {
				object[key] = descriptor.value;
			};
		}());
		var toStr = Object.prototype.toString;
		var isCallable = function(fn) {
			// In a perfect world, the `typeof` check would be sufficient. However,
			// in Chrome 1–12, `typeof /x/ == 'object'`, and in IE 6–8
			// `typeof alert == 'object'` and similar for other host objects.
			return typeof fn == 'function' || toStr.call(fn) == '[object Function]';
		};
		var toInteger = function(value) {
			var number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number == 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function(value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};
		var from = function(arrayLike) {
			var C = this;
			if (arrayLike == null) {
				throw new TypeError('`Array.from` requires an array-like object, not `null` or `undefined`');
			}
			var items = Object(arrayLike);
			var mapping = arguments.length > 1;

			var mapFn, T;
			if (arguments.length > 1) {
				mapFn = arguments[1];
				if (!isCallable(mapFn)) {
					throw new TypeError('When provided, the second argument to `Array.from` must be a function');
				}
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			var len = toLength(items.length);
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);
			var k = 0;
			var kValue, mappedValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					mappedValue = typeof T == 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					mappedValue = kValue;
				}
				defineProperty(A, <string><any>k, {
					'value': mappedValue,
					'configurable': true,
					'enumerable': true
				});
				++k;
			}
			A.length = len;
			return A;
		};
		defineProperty(Array, 'from', {
			'value': from,
			'configurable': true,
			'writable': true
		});
	}());
}
