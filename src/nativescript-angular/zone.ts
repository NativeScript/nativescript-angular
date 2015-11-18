// Borrowed from the react-native-renderer project at:
// https://github.com/uber5001/react-native-renderer
import NativeScriptPatch from "./zone_patch"

var core = require('zone.js/lib/core.js');

var zone = global.zone = new core.Zone()
console.log('Created zone.');

NativeScriptPatch.apply();
