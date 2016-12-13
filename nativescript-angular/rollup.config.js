class DebugInfoRoll {
    constructor(options){
        this.options = options;
    }
    resolveId(id, from){
        console.log(id, from);
    }
}

const debugInfoRoll = (config) => new DebugInfoRoll(config);

export default {
    entry: "rollup-entry.js",
    dest: "bundle.all.js",
    format: "cjs",
    sourceMap: "inline",
    external: ["@angular"],
    treeshake: false,
    plugins: [
        //debugInfoRoll(),
    ]
}
