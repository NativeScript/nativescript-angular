declare var assert: any;

interface BrowserNodeGlobal {
  Object: typeof Object;
  Array: typeof Array;
  Map: typeof Map;
  Set: typeof Set;
  Date: typeof Date;
  RegExp: typeof RegExp;
  JSON: typeof JSON;
  Math: typeof Math;
  assert(condition: any): void;
  Reflect: any;
  zone: Zone;
  getAngularTestability: Function;
  getAllAngularTestabilities: Function;
  setTimeout: Function;
  clearTimeout: Function;
  setInterval: Function;
  clearInterval: Function;
}

interface Map<K, V> {
    keys(): Array<K>;
    values(): Array<V>;
}

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
