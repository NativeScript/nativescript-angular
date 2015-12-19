// Borrowed from the react-native-renderer project at:
// https://github.com/uber5001/react-native-renderer
import NativeScriptPatch from "./zone_patch"

var core = require('zone.js/lib/core.js');

global.Zone = core.Zone;
global.zone = new core.Zone();

NativeScriptPatch.apply();
