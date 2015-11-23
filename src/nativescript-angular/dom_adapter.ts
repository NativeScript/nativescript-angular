import {Parse5DomAdapter} from 'angular2/src/core/dom/parse5_adapter';
import {setRootDomAdapter} from 'angular2/src/core/dom/dom_adapter';
import {Type} from 'angular2/src/facade/lang';

export class NativeScriptDomAdapter extends Parse5DomAdapter {
  static makeCurrent() { setRootDomAdapter(new NativeScriptDomAdapter()); }

  getXHR(): Type {
      console.log('getXHR!');
      return null;
  }

  hasProperty(element, name: string) {
      //TODO: actually check if the property exists.
      return true;
  }
}
