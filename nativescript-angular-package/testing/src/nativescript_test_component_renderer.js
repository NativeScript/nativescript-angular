Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var proxy_view_container_1 = require("tns-core-modules/ui/proxy-view-container");
var util_1 = require("./util");
/**
 * A NativeScript based implementation of the TestComponentRenderer.
 */
var NativeScriptTestComponentRenderer = /** @class */ (function (_super) {
    __extends(NativeScriptTestComponentRenderer, _super);
    function NativeScriptTestComponentRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeScriptTestComponentRenderer.prototype.insertRootElement = function (rootElId) {
        var layout = new proxy_view_container_1.ProxyViewContainer();
        layout.id = rootElId;
        var rootLayout = util_1.testingRootView();
        rootLayout.addChild(layout);
    };
    NativeScriptTestComponentRenderer = __decorate([
        core_1.Injectable()
    ], NativeScriptTestComponentRenderer);
    return NativeScriptTestComponentRenderer;
}(testing_1.TestComponentRenderer));
exports.NativeScriptTestComponentRenderer = NativeScriptTestComponentRenderer;
//# sourceMappingURL=nativescript_test_component_renderer.js.map