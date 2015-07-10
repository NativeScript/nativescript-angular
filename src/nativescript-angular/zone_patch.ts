var patchSetClearFunction = require('zone.js/lib/patch/functions').patchSetClearFunction;
var patchSetFunction = require('zone.js/lib/patch/functions').patchSetFunction;
var promisePatch = require('zone.js/lib/patch/promise');

function apply() {
	patchSetClearFunction(global, ['timeout', 'interval', 'immediate']);
	patchSetFunction(global, ['requestAnimationFrame']);

	promisePatch.apply();
}

export default {
	apply: apply
}
