import {ElementSchemaRegistry} from '@angular/compiler';
import {SanitizationService} from '@angular/core/src/security';
import {Parse5DomAdapter} from '@angular/platform-server';
import {setRootDomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {Type} from '@angular/core/src/facade/lang';
import {rendererLog, rendererError} from "./trace";

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

  getMappedPropName(propName: string): string {
      return propName;
  }

  securityContext(tagName: string, propName: string): any {
      return SecurityContext.NONE;
  }
}

export class NativeScriptSanitizationService extends SanitizationService {
    sanitize(context: SecurityContext, value: string): string {
        return value;
    }
}

export class NativeScriptDomAdapter extends Parse5DomAdapter {
  static makeCurrent() {
      rendererLog("Setting DOM");
      setRootDomAdapter(new NativeScriptDomAdapter());
  }

  getXHR(): Type {
      return null;
  }

  hasProperty(element, name: string) {
      //TODO: actually check if the property exists.
      return true;
  }
}
