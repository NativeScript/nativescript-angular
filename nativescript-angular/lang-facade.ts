//Copied unexported functions from @angular/core/src/facade/lang
var globalScope = global;
export var global = globalScope;

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function isNumber(obj: any): boolean {
  return typeof obj === 'number';
}

export function isDate(obj: any): obj is Date {
  return obj instanceof Date && !isNaN(obj.valueOf());
}

export function print(obj: Error | Object) {
  console.log(obj);
}

export function isJsObject(o: any): boolean {
  return o !== null && (typeof o === 'function' || typeof o === 'object');
}

export function isArray(obj: any): boolean {
  return Array.isArray(obj);
}

// When Symbol.iterator doesn't exist, retrieves the key used in es6-shim
declare var Symbol: any;
var _symbolIterator: any = null;
export function getSymbolIterator(): string|symbol {
  if (isBlank(_symbolIterator)) {
    if (isPresent((<any>globalScope).Symbol) && isPresent(Symbol.iterator)) {
      _symbolIterator = Symbol.iterator;
    } else {
      // es6-shim specific logic
      var keys = Object.getOwnPropertyNames(Map.prototype);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        if (key !== 'entries' && key !== 'size' &&
            (Map as any).prototype[key] === Map.prototype['entries']) {
          _symbolIterator = key;
        }
      }
    }
  }
  return _symbolIterator;
}

export class DateWrapper {
  static create(
      year: number, month: number = 1, day: number = 1, hour: number = 0, minutes: number = 0,
      seconds: number = 0, milliseconds: number = 0): Date {
    return new Date(year, month - 1, day, hour, minutes, seconds, milliseconds);
  }
  static fromISOString(str: string): Date { return new Date(str); }
  static fromMillis(ms: number): Date { return new Date(ms); }
  static toMillis(date: Date): number { return date.getTime(); }
  static now(): Date { return new Date(); }
  static toJson(date: Date): string { return date.toJSON(); }
}

export function setValueOnPath(global: any, path: string, value: any) {
  var parts = path.split('.');
  var obj: any = global;
  while (parts.length > 1) {
    var name = parts.shift();
    if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
      obj = obj[name];
    } else {
      obj = obj[name] = {};
    }
  }
  if (obj === undefined || obj === null) {
    obj = {};
  }
  obj[parts.shift()] = value;
}
