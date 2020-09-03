import { ApplicationModule, ErrorHandler, NO_ERRORS_SCHEMA, NgModule, RendererFactory2, SystemJsNgModuleLoader, Optional, SkipSelf, ɵINJECTOR_SCOPE } from '@angular/core';

import { ViewportScroller, ɵNullViewportScroller as NullViewportScroller } from '@angular/common';

import { NativeScriptCommonModule } from './common';
import { NativeScriptRendererFactory } from './renderer-factory';
import { DetachedLoader } from './common/detached-loader';
import { throwIfAlreadyLoaded } from './common/utils';
import { FrameService } from './frame.service';

export function errorHandlerFactory() {
	return new ErrorHandler();
}

export { DetachedLoader } from './common/detached-loader';

@NgModule({
	declarations: [DetachedLoader],
	providers: [FrameService, NativeScriptRendererFactory, SystemJsNgModuleLoader, { provide: ɵINJECTOR_SCOPE, useValue: 'root' }, { provide: ErrorHandler, useFactory: errorHandlerFactory }, { provide: RendererFactory2, useExisting: NativeScriptRendererFactory }, { provide: ViewportScroller, useClass: NullViewportScroller }],
	entryComponents: [DetachedLoader],
	imports: [ApplicationModule, NativeScriptCommonModule],
	exports: [ApplicationModule, NativeScriptCommonModule, DetachedLoader],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativeScriptModule {
	constructor(@Optional() @SkipSelf() parentModule: NativeScriptModule) {
		// Prevents NativeScriptModule from getting imported multiple times
		throwIfAlreadyLoaded(parentModule, 'NativeScriptModule');
	}
}
