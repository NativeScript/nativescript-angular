var profiling = require('./profiling');
console.log('import main-page');

exports.createPage = function() {
    console.dump(page);
    var pageModule = require('ui/page');
    var textView = require('ui/text-view');
    var page = new pageModule.Page();
    page.on('loaded', function() {
        profiling.stop('application-start');
        console.log('Page loaded');

        var box = new textView.TextView();
        box.text = "Хуяк хуяк!";

        page.content = box;
    });
    return page;
};
