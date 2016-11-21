//Copied unexported functions from @angular/core/src/facade/collection
import {
    isJsObject, isArray, getSymbolIterator,
    isPresent, isBlank
} from "./lang-facade";

export function isListLikeIterable(obj: any): boolean {
  if (!isJsObject(obj)) return false;
  return isArray(obj) ||
      (!(obj instanceof Map) &&      // JS Map are iterables but return entries as [k, v]
       getSymbolIterator() in obj);  // JS Iterable have a Symbol.iterator prop
}

export class ListWrapper {
  // JS has no way to express a statically fixed size list, but dart does so we
  // keep both methods.
  static createFixedSize(size: number): any[] { return new Array(size); }
  static createGrowableSize(size: number): any[] { return new Array(size); }
  static clone<T>(array: T[]): T[] { return array.slice(0); }
  static forEachWithIndex<T>(array: T[], fn: (t: T, n: number) => void) {
    for (var i = 0; i < array.length; i++) {
      fn(array[i], i);
    }
  }
  static first<T>(array: T[]): T {
    if (!array) return null;
    return array[0];
  }
  static last<T>(array: T[]): T {
    if (!array || array.length == 0) return null;
    return array[array.length - 1];
  }
  static indexOf<T>(array: T[], value: T, startIndex: number = 0): number {
    return array.indexOf(value, startIndex);
  }
  static contains<T>(list: T[], el: T): boolean { return list.indexOf(el) !== -1; }
  static reversed<T>(array: T[]): T[] {
    var a = ListWrapper.clone(array);
    return a.reverse();
  }
  static concat(a: any[], b: any[]): any[] { return a.concat(b); }
  static insert<T>(list: T[], index: number, value: T) { list.splice(index, 0, value); }
  static removeAt<T>(list: T[], index: number): T {
    var res = list[index];
    list.splice(index, 1);
    return res;
  }
  static removeAll<T>(list: T[], items: T[]) {
    for (var i = 0; i < items.length; ++i) {
      var index = list.indexOf(items[i]);
      list.splice(index, 1);
    }
  }
  static remove<T>(list: T[], el: T): boolean {
    var index = list.indexOf(el);
    if (index > -1) {
      list.splice(index, 1);
      return true;
    }
    return false;
  }
  static clear(list: any[]) { list.length = 0; }
  static isEmpty(list: any[]): boolean { return list.length == 0; }
  static fill(list: any[], value: any, start: number = 0, end: number = null) {
    (<any>list).fill(value, start, end === null ? list.length : end);
  }
  static equals(a: any[], b: any[]): boolean {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  static slice<T>(l: T[], from: number = 0, to: number = null): T[] {
    return l.slice(from, to === null ? undefined : to);
  }
  static splice<T>(l: T[], from: number, length: number): T[] { return l.splice(from, length); }
  static sort<T>(l: T[], compareFn?: (a: T, b: T) => number) {
    if (isPresent(compareFn)) {
      l.sort(compareFn);
    } else {
      l.sort();
    }
  }
  static toString<T>(l: T[]): string { return l.toString(); }
  static toJSON<T>(l: T[]): string { return JSON.stringify(l); }

  static maximum<T>(list: T[], predicate: (t: T) => number): T {
    if (list.length == 0) {
      return null;
    }
    var solution: any /** TODO #???? */ = null;
    var maxValue = -Infinity;
    for (var index = 0; index < list.length; index++) {
      var candidate = list[index];
      if (isBlank(candidate)) {
        continue;
      }
      var candidateValue = predicate(candidate);
      if (candidateValue > maxValue) {
        solution = candidate;
        maxValue = candidateValue;
      }
    }
    return solution;
  }

  static flatten<T>(list: Array<T|T[]>): T[] {
    var target: any[] = [];
    _flattenArray(list, target);
    return target;
  }

  static addAll<T>(list: Array<T>, source: Array<T>): void {
    for (var i = 0; i < source.length; i++) {
      list.push(source[i]);
    }
  }
}

function _flattenArray(source: any[], target: any[]): any[] {
  if (isPresent(source)) {
    for (var i = 0; i < source.length; i++) {
      var item = source[i];
      if (isArray(item)) {
        _flattenArray(item, target);
      } else {
        target.push(item);
      }
    }
  }
  return target;
}
