module.exports = {
    "@nativescript/angular": {
        "entryPoints": {
            ".": {
                "override": {
                    "main": "./index.js",
                    "typings": "./index.d.ts",
                },
                "ignoreMissingDependencies": true,
            },
        }
    }
}