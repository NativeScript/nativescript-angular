import { Application, TextView, Color, View, Frame, GridLayout, LaunchEventData, ApplicationEventData, profile, profilingUptime, Page, LayoutBase } from '@nativescript/core';
// import './dom-adapter';
// import 'nativescript-intl';

import { Type, Injector, CompilerOptions, PlatformRef, NgModuleFactory, NgModuleRef, EventEmitter, Sanitizer, InjectionToken, StaticProvider } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { NativeScriptDebug } from './trace';
import { defaultPageFactoryProvider, setRootPage, PageFactory, PAGE_FACTORY, getRootPage } from './platform-providers';
import { AppHostView, AppHostAsyncView } from './app-host-view';

export const onBeforeLivesync = new EventEmitter<NgModuleRef<any>>();
export const onAfterLivesync = new EventEmitter<{
	moduleRef?: NgModuleRef<any>;
	error?: Error;
}>();
let lastBootstrappedModule: WeakRef<NgModuleRef<any>>;
type BootstrapperAction = () => Promise<NgModuleRef<any>>;

// Work around a TS bug requiring an import of OpaqueToken without using it
// if ((<any>global).___TS_UNUSED) {
//     (() => {
//         return InjectionToken;
//     })();
// }

// tslint:disable:max-line-length
/**
 * Options to be passed when HMR is enabled
 */
export interface HmrOptions {
	/**
	 * A factory function that returns either Module type or NgModuleFactory type.
	 * This needs to be a factory function as the types will change when modules are replaced.
	 */
	moduleTypeFactory?: () => Type<any> | NgModuleFactory<any>;

	/**
	 * A livesync callback that will be called instead of the original livesync.
	 * It gives the HMR a hook to apply the module replacement.
	 * @param bootstrapPlatform - A bootstrap callback to be called after HMR is done. It will bootstrap a new angular app within the exisiting platform, using the moduleTypeFactory to get the Module or NgModuleFactory to be used.
	 */
	livesyncCallback: (bootstrapPlatform: () => void) => void;
}
// tslint:enable:max-line-length

export interface AppLaunchView extends LayoutBase {
	// called when the animation is to begin
	startAnimation?: () => void;
	// called when bootstrap is complete and cleanup can begin
	// should resolve when animation is completely finished
	cleanup?: () => Promise<any>;
}

export interface AppOptions {
	bootInExistingPage?: boolean;
	cssFile?: string;
	startPageActionBarHidden?: boolean;
	hmrOptions?: HmrOptions;
	/**
	 * Background color of the root view
	 */
	backgroundColor?: string;
	/**
	 * Use animated launch view (async by default)
	 */
	launchView?: AppLaunchView;
	/**
	 * When using Async APP_INITIALIZER, set this to `true`.
	 * (Not needed when using launchView)
	 */
	async?: boolean;
}

export type PlatformFactory = (extraProviders?: StaticProvider[]) => PlatformRef;

export class NativeScriptSanitizer extends Sanitizer {
	sanitize(_context: any, value: string): string {
		return value;
	}
}

export class NativeScriptDocument {
	// Required by the AnimationDriver
	public body: any = {
		isOverride: true,
	};

	createElement(tag: string) {
		throw new Error('NativeScriptDocument is not DOM Document. There is no createElement() method.');
	}
}

export const COMMON_PROVIDERS = [defaultPageFactoryProvider, { provide: Sanitizer, useClass: NativeScriptSanitizer, deps: [] }, { provide: DOCUMENT, useClass: NativeScriptDocument, deps: [] }];

export class NativeScriptPlatformRef extends PlatformRef {
	private _bootstrapper: BootstrapperAction;

	constructor(private platform: PlatformRef, private appOptions: AppOptions = {}) {
		super();
	}

	@profile
	bootstrapModuleFactory<M>(moduleFactory: NgModuleFactory<M>): Promise<NgModuleRef<M>> {
		this._bootstrapper = () => {
			let bootstrapFactory = moduleFactory;
			if (this.appOptions.hmrOptions) {
				bootstrapFactory = <NgModuleFactory<M>>this.appOptions.hmrOptions.moduleTypeFactory();
			}

			return this.platform.bootstrapModuleFactory(bootstrapFactory);
		};

		this.bootstrapApp();

		return null; // Make the compiler happy
	}

	@profile
	bootstrapModule<M>(moduleType: Type<M>, compilerOptions: CompilerOptions | CompilerOptions[] = []): Promise<NgModuleRef<M>> {
		this._bootstrapper = () => {
			let bootstrapType = moduleType;
			if (this.appOptions.hmrOptions) {
				bootstrapType = <Type<M>>this.appOptions.hmrOptions.moduleTypeFactory();
			}

			return this.platform.bootstrapModule(bootstrapType, compilerOptions);
		};
		this.bootstrapApp();

		return null; // Make the compiler happy
	}

	@profile
	private bootstrapApp() {
		(<any>global).__onLiveSyncCore = () => {
			if (this.appOptions.hmrOptions) {
				const rootView = Application.getRootView();
				if (rootView) {
					rootView._closeAllModalViewsInternal();
				}

				this.appOptions.hmrOptions.livesyncCallback(() => this._livesync());
			} else {
				this._livesync();
			}
		};

		if (this.appOptions && typeof this.appOptions.cssFile === 'string') {
			Application.setCssFileName(this.appOptions.cssFile);
		}

		this.bootstrapNativeScriptApp();
	}

	onDestroy(callback: () => void): void {
		this.platform.onDestroy(callback);
	}

	get injector(): Injector {
		return this.platform.injector;
	}

	destroy(): void {
		this.platform.destroy();
	}

	get destroyed(): boolean {
		return this.platform.destroyed;
	}

	@profile
	private bootstrapNativeScriptApp() {
		let rootContent: View;

		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.bootstrapLog('NativeScriptPlatform bootstrap started.');
		}
		const launchCallback = profile('@nativescript/angular/platform-common.launchCallback', (args: LaunchEventData) => {
			if (NativeScriptDebug.isLogEnabled()) {
				NativeScriptDebug.bootstrapLog('Application launch event fired');
			}

			// Create a temp page for root of the renderer
			let tempAppHostView: AppHostView;
			let tempAppHostAsyncView: AppHostAsyncView;
			if (this.appOptions && (this.appOptions.async || this.appOptions.launchView)) {
				tempAppHostAsyncView = new AppHostAsyncView(new Color(this.appOptions && this.appOptions.backgroundColor ? this.appOptions.backgroundColor : '#fff'));
				if (this.appOptions.launchView) {
					this.appOptions.launchView.style.zIndex = 1000;
					tempAppHostAsyncView.addChild(this.appOptions.launchView);
				}
				rootContent = tempAppHostAsyncView.ngAppRoot;
				setRootPage(<any>tempAppHostAsyncView);
			} else {
				tempAppHostView = new AppHostView(new Color(this.appOptions && this.appOptions.backgroundColor ? this.appOptions.backgroundColor : '#fff'));
				setRootPage(<any>tempAppHostView);
			}

			let bootstrapPromiseCompleted = false;
			const bootstrap = () => {
				this._bootstrapper().then(
					(moduleRef) => {
						bootstrapPromiseCompleted = true;
						if (NativeScriptDebug.isLogEnabled()) {
							NativeScriptDebug.bootstrapLog(`Angular bootstrap bootstrap done. uptime: ${profilingUptime()}`);
						}

						if (this.appOptions.launchView && this.appOptions.launchView.cleanup) {
							this.appOptions.launchView.cleanup().then(() => {
								// cleanup any custom launch views
								tempAppHostAsyncView.removeChild(this.appOptions.launchView);
								this.appOptions.launchView = null;
							});
						} else if (tempAppHostView) {
							rootContent = tempAppHostView.content;
						}

						lastBootstrappedModule = new WeakRef(moduleRef);
					},
					(err) => {
						bootstrapPromiseCompleted = true;
						const errorMessage = err.message + '\n\n' + err.stack;
						if (NativeScriptDebug.isLogEnabled()) {
							NativeScriptDebug.bootstrapLogError('ERROR BOOTSTRAPPING ANGULAR');
						}
						if (NativeScriptDebug.isLogEnabled()) {
							NativeScriptDebug.bootstrapLogError(errorMessage);
						}

						rootContent = this.createErrorUI(errorMessage);
					}
				);
				if (NativeScriptDebug.isLogEnabled()) {
					NativeScriptDebug.bootstrapLog('bootstrapAction called, draining micro tasks queue. Root: ' + rootContent);
				}
				(<any>global).Zone.drainMicroTaskQueue();
				if (NativeScriptDebug.isLogEnabled()) {
					NativeScriptDebug.bootstrapLog('bootstrapAction called, draining micro tasks queue finished! Root: ' + rootContent);
				}
			};

			if (this.appOptions && this.appOptions.launchView && this.appOptions.launchView.startAnimation) {
				// start animations on next tick (after initial boot)
				setTimeout(() => {
					// ensure launch animation is executed after launchView added to view stack
					this.appOptions.launchView.startAnimation();
				});
			}
			bootstrap();
			// if (!bootstrapPromiseCompleted) {
			// 	const errorMessage = "Bootstrap promise didn't resolve";
			// 	if (NativeScriptDebug.isLogEnabled()) {
			// 		NativeScriptDebug.bootstrapLogError(errorMessage);
			// 	}
			// 	rootContent = this.createErrorUI(errorMessage);
			// }
			args.root = rootContent;
		});
		const exitCallback = profile('@nativescript/angular/platform-common.exitCallback', (args: ApplicationEventData) => {
			const androidActivity = args.android;
			if (androidActivity && !androidActivity.isFinishing()) {
				// Exit event was triggered as a part of a restart of the app.
				return;
			}

			const lastModuleRef = lastBootstrappedModule ? lastBootstrappedModule.get() : null;
			if (lastModuleRef) {
				// Make sure the module is only destroyed once
				lastBootstrappedModule = null;

				lastModuleRef.destroy();
			}

			rootContent = null;
		});

		Application.on(Application.launchEvent, launchCallback);
		Application.on(Application.exitEvent, exitCallback);

		Application.run();
	}

	@profile
	public _livesync() {
		if (NativeScriptDebug.isLogEnabled()) {
			NativeScriptDebug.bootstrapLog('Angular livesync started.');
		}

		const lastModuleRef = lastBootstrappedModule ? lastBootstrappedModule.get() : null;
		onBeforeLivesync.next(lastModuleRef);
		if (lastModuleRef) {
			lastModuleRef.destroy();
		}

		this._bootstrapper().then(
			(moduleRef) => {
				if (NativeScriptDebug.isLogEnabled()) {
					NativeScriptDebug.bootstrapLog('Angular livesync done.');
				}
				onAfterLivesync.next({ moduleRef });

				lastBootstrappedModule = new WeakRef(moduleRef);
				Application.resetRootView({
					create: () => (getRootPage() instanceof AppHostView ? ((<any>getRootPage()) as AppHostView).ngAppRoot : getRootPage()),
				});
			},
			(error) => {
				if (NativeScriptDebug.isLogEnabled()) {
					NativeScriptDebug.bootstrapLogError('ERROR LIVESYNC BOOTSTRAPPING ANGULAR');
				}
				const errorMessage = error.message + '\n\n' + error.stack;
				if (NativeScriptDebug.isLogEnabled()) {
					NativeScriptDebug.bootstrapLogError(errorMessage);
				}

				Application.resetRootView({
					create: () => this.createErrorUI(errorMessage),
				});
				onAfterLivesync.next({ error });
			}
		);
	}

	private createErrorUI(message: string): View {
		const errorTextBox = new TextView();
		errorTextBox.text = message;
		errorTextBox.color = new Color('red');
		return errorTextBox;
	}

	private createFrameAndPage(isLivesync: boolean) {
		const frame = new Frame();
		const pageFactory: PageFactory = this.platform.injector.get(PAGE_FACTORY);
		const page = pageFactory({ isBootstrap: true, isLivesync });

		frame.navigate({
			create: () => {
				return page;
			},
		});
		return { page, frame };
	}
}
