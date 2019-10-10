console.log("Hi!");
console.log(process.argv);

var myArgs = process.argv.slice(2);

console.log(`Packing with @nativescript/angular: ${myArgs}`);
