module.exports = {
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