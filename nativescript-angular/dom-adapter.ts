import { ElementSchemaRegistry } from '@angular/compiler';
import { Sanitizer, SchemaMetadata } from '@angular/core';
import { Parse5DomAdapter } from "./parse5_adapter";
import { setRootDomAdapter } from './private_import_platform-browser';
import { rendererLog, rendererError } from "./trace";
import { print } from "./lang-facade";

export enum SecurityContext {
  NONE,
  HTML,
  STYLE,
  SCRIPT,
  URL,
  RESOURCE_URL,
}

export class NativeScriptElementSchemaRegistry extends ElementSchemaRegistry {
  hasProperty(tagName: string, propName: string): boolean {
    return true;
  }

  hasElement(tagName: string, schemaMetas: SchemaMetadata[]): boolean {
    return true;
  }


  getMappedPropName(propName: string): string {
    return propName;
  }

  getDefaultComponentElementName(): string {
    return 'ng-component';
  }

  securityContext(tagName: string, propName: string): any {
    return SecurityContext.NONE;
  }

  validateProperty(name: string): { error: boolean, msg?: string } {
    return { error: false };
  }

  validateAttribute(name: string): { error: boolean, msg?: string } {
    return { error: false };
  }

  allKnownElementNames(): string[] {
    return [];
  }

  normalizeAnimationStyleProperty(propName: string): string {
    return propName;
  }

  normalizeAnimationStyleValue(camelCaseProp: string, userProvidedProp: string, val: string | number):
    { error: string, value: string } {
    return { error: null, value: val.toString() };
  }
}

export class NativeScriptDomAdapter extends Parse5DomAdapter {
  static makeCurrent() {
    rendererLog("Setting DOM");
    setRootDomAdapter(new NativeScriptDomAdapter());
  }

  hasProperty(element, name: string) {
    //TODO: actually check if the property exists.
    return true;
  }

  log(arg: any): void {
    print(arg);
  }

  logError(arg: any): void {
    print(arg);
  }

  logGroup(arg: any): void {
    print(arg);
  }

  logGroupEnd(): void {
  }
}
