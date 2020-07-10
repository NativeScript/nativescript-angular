export function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
	if (parentModule) {
		throw new Error(`${moduleName} has already been loaded. Import ${moduleName} in the AppModule only.`);
	}
}

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
