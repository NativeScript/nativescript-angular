var profiling = require('./profiling');
var vmModule = require("./main-view-model");
function pageLoaded(args) {
    profiling.stop('application-start');
    var page = args.object;
    page.bindingContext = vmModule.mainViewModel;
}
exports.pageLoaded = pageLoaded;
