var path = require("path");

module.exports = {
    context: "./platforms/android/src/main/assets/app",
    entry: {
        app: "./app",
    },
    output: {
        path: __dirname,
        pathinfo: true,
        libraryTarget: "commonjs2",
        filename: "bundle.js"
    },
    //externals: {
    //"crypto": "crypto",
    //"process/browser.js": "process",
    //"module.js": "module"
    //},
    externals: [
        function(context, request, callback) {
            //if (/\/module\.js$/.test(request))
                //return callback(null, "var module");
            //else if (/browserify|crypto/.test(request)) {
            if (/browserify|crypto/.test(request)) {
                return callback(null, "var {}");
            } else {
                callback();
            }
        }
    ],
    resolve: {
        extensions: ["", ".js"],
        packageMains: ["main"],
        modulesDirectories: [
            "tns_modules",
        ]
    },
    module: {
        loaders: [
        ]
    }
}
