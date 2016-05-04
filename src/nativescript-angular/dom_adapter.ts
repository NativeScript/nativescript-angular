import {ElementSchemaRegistry} from '@angular/compiler';
import {Parse5DomAdapter} from '@angular/platform-server/src/parse5_adapter';
import {setRootDomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';
import {Type} from '@angular/core/src/facade/lang';

export class NativeScriptElementSchemaRegistry extends ElementSchemaRegistry {
  hasProperty(tagName: string, propName: string): boolean {
      return true;
  }

  getMappedPropName(propName: string): string {
      return propName;
  }
}

export class NativeScriptDomAdapter extends Parse5DomAdapter {
  static makeCurrent() {
      console.log("Setting DOM");
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
