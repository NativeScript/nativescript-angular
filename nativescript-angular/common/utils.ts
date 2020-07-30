/**
 * Utility method to ensure a NgModule is only imported once in a codebase, otherwise will throw to help prevent accidental double importing
 * @param parentModule Parent module name
 * @param moduleName The module name
 */
export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
	if (parentModule) {
		throw new Error(`${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`);
	}
}

/**
 * Utility method which will only fire the callback once ever
 * @param fn callback to call only once
 */
export function once(fn: Function) {
	let wasCalled = false;

	return function wrapper() {
		if (wasCalled) {
			return;
		}

		wasCalled = true;
		fn.apply(null, arguments);
	};
}
