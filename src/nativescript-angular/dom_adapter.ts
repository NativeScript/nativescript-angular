import {Parse5DomAdapter} from 'angular2/src/dom/parse5_adapter';
import {setRootDomAdapter} from 'angular2/src/dom/dom_adapter';

export class NativeScriptDomAdapter extends Parse5DomAdapter {
  static makeCurrent() { setRootDomAdapter(new NativeScriptDomAdapter()); }

  hasProperty(element, name: string) {
      //TODO: actually check if the property exists.
      return true;
  }
}
