/// <reference path="../node_modules/tns-core-modules/tns-core-modules.d.ts" />

interface Map<K, V> {
    keys(): Array<K>;
    values(): Array<V>;
}

declare type MapConstructor = typeof Map;
declare type SetConstructor = typeof Set;
