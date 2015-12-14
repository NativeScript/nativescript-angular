var path = require("path");
var webpack = require("webpack");


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
    externals: [
        function(context, request, callback) {
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
    },
    plugins: [
        new webpack.DefinePlugin({
            global: 'global',
            __dirname: '__dirname'
        }),
    ]
};
