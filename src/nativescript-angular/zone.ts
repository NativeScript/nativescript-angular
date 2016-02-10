// Borrowed from the react-native-renderer project at:
// https://github.com/uber5001/react-native-renderer
import NativeScriptPatch from "./zone_patch"

var core = require('zone.js/lib/core.js');

(<any>global).Zone = core.Zone;
(<any>global).zone = new core.Zone();

NativeScriptPatch.apply();
