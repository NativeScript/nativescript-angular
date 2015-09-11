Bringing NativeScript and Angular 2 together. This project implements a renderer that lets you build native mobile apps with Angular using the NativeScript widgets.

# Prerequisites

## TSD for TypeScript declarations

You may need to configure your `tsd` GitHub access token to avoid rate-limit-related download errors. See the token installation instructions in the `.tsdrc` section [here](https://github.com/DefinitelyTyped/tsd#tsdrc).

## Mobile SDK's

You will also need the [Android SDK](https://developer.android.com/sdk/) to build this project. Install it manually before continuing with the next steps.

iOS development requires an OS X machine. Details available in the NativeScript [documentation](http://docs.nativescript.org/setup/ns-cli-setup/ns-setup-os-x).

## NativeScript

Then install the NativeScript tools according to: [this article](http://docs.nativescript.org/setup/quick-setup).

# Adding dependencies

Edit your `package.json` file and add the following dependencies:

```json

	"dependencies": {
		"angular2": "2.0.0-alpha.36",
		"nativescript-angular": "0.0.2",
		"parse5": "1.4.2",
		"punycode": "1.3.2",
		"querystring": "0.2.0",
		"reflect-metadata": "0.1.0",
		"rtts_assert": "2.0.0-alpha.36",
		"rx": "2.5.1",
		"url": "0.10.3",
		"zone.js": "0.5.3"
	}

```

Remember to run `npm install` to fetch the modules from NPM.

# Getting TypeScript declarations

Once you have the `tsd` tool installed you can use it to get the needed TypeScript definitions.


Get the ones for Angular and related components:

`$ tsd install angular2 rx es6-promise --save`

Then include the bundled `d.ts` files from the `nativescript-angular` package.

`$ tsd link`


# Bootstrapping an Angular app with NativeScript

This is not much different than a regular Angular web app. You need to import the `nativeScriptBootstrap` function:

```typescript
import 'reflect-metadata';
import {nativeScriptBootstrap} from 'nativescript-angular/application';
```

(Note that you need `reflect-metadata` imported beforehand -- the Angular DI system depends on it.)


Then call the bootstrap function in a `loaded` event handler:

```typescript
export function pageLoaded(args) {
    console.log('BOOTSTRAPPING...');
    nativeScriptBootstrap(MainPage, []).then((appRef) => {
        console.log('ANGULAR BOOTSTRAP DONE.');
    }, (err) =>{
        console.log('ERROR BOOTSTRAPPING ANGULAR');
        let errorMessage = err.message + "\n\n" + err.stack;
        console.log(errorMessage);
    });
}
```

In the example above `MainPage` is an Angular component that looks roughly like this:

```typescript
@Component({
	selector: 'main'
})
@View({
	template: `
    <Label text='Hello world!'></Label>
`,
})
class MainPage {
    //...
}
```
