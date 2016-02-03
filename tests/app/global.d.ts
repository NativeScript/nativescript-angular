/// <reference path="../node_modules/tns-core-modules/tns-core-modules.d.ts" />
declare var assert: any;

interface Map<K, V> {
    keys(): Array<K>;
    values(): Array<V>;
}

declare type MapConstructor = typeof Map;
declare type SetConstructor = typeof Set;

interface NumberConstructor {
    isInteger(number: number): boolean;
}

interface Array<T> {
    fill(value: T, start?: number, end?: number): T[];
}

interface String {
    endsWith(searchString: string, endPosition?: number): boolean;
    startsWith(searchString: string, position?: number): boolean;
}

interface Zone {
}
