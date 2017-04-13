import { assert } from "../test-config";
import { inject, TestBed } from '@angular/core/testing';
import { AppComponent } from '../../app.component';

describe('AppComponent', () => {

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppComponent
      ]
    });
  });

  it('should init', inject([AppComponent], (appComponent: AppComponent) => {
    assert.isDefined(appComponent);
  }));

});
