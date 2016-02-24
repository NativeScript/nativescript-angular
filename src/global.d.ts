/// <reference path="../node_modules/tns-core-modules/tns-core-modules.d.ts" />

//Compatibility interfaces for rxjs

interface IteratorResult<T> {
    done: boolean;
    value?: T;
}

interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
