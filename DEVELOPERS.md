# NativeScript - Angular 2 integration

## Running stuff locally

Clone the repo and cd to the local dir.

Fetch the git submodules:

```sh
    git submodule --init
    git submodule --update
```

Install the npm requirements:

```sh
    npm install
```

Install the angular npm requirements:

```sh
    cd angular
    npm install
    cd ..  # back to the project root
```

Install the angular typings:

```sh
    cd deps/angular/modules/angular2
    tsd reinstall
    cd ../../../../  # back to the project root
```

Prepare the local angular2 & NativeScript codebases in src/*:

```sh
    grunt prepare
```

Compile the project:

```sh
    grunt ts
```
