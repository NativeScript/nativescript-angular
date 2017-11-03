const { unlinkSync } = require("fs");

unlinkSync("./polyfills/console.metadata.json");
unlinkSync("./polyfills/array.metadata.json");

