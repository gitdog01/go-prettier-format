# Prettier Plugin for Go (using WASM)

[![npm version](https://img.shields.io/npm/v/go-prettier-format.svg)](https://www.npmjs.com/package/go-prettier-format)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is a [Prettier](https://prettier.io/) v3 plugin for the Go programming language. It formats Go code using the official `go/format` package, which is compiled to WebAssembly (WASM) to run in a Node.js environment.

## Background

As web developers, we love the consistent code style that Prettier brings to our projects. However, when working on projects that involve Go - for instance, a Go backend with a JavaScript frontend, or writing Go code in a web-based editor - the ability to format Go code with the same familiar tool was missing.

This project was born out of the desire to have a single, unified formatting toolchain. Instead of relying on external `gofmt` binaries, which can be brittle to manage in a Node.js-based development environment, this plugin leverages the power of WebAssembly. We compile Go's own formatting tools into a WASM module, allowing you to format Go code directly within your JavaScript-based tools, ensuring speed, portability, and consistency.

## Installation

First, install Prettier (v3 or later) and this plugin from NPM:

```bash
npm install --save-dev prettier go-prettier-format
```

The plugin comes with a pre-compiled WASM module, so you don't need to have Go installed on your machine to use it.

## Usage

### Command Line

You can run Prettier from the command line to format your Go files:

```bash
# Format a specific file
npx prettier --write your-file.go

# Format all .go files in the project
npx prettier --write "**/*.go"
```

> Note: For cross-platform compatibility in npm scripts, it's recommended to use single quotes: `'**/*.go'`.

### package.json Script

For convenience, you can add a script to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write '**/*.go'"
  }
}
```

### Editor Integration

Once installed, Prettier-compatible editors (like VS Code with the Prettier extension) should automatically pick up the plugin and use it to format `.go` files on save.

## For Contributors

Interested in contributing? Here's how to get set up for development.

### Development Setup

You will need to have Go installed on your machine to build the WASM module from the source.

1.  Clone the repository and install dependencies:
    ```bash
    git clone https://github.com/gitdog01/go-prettier-format.git
    cd go-prettier-format
    npm install
    ```

2.  Build the WASM module:
    ```bash
    npm run build:wasm
    ```

### Testing the Plugin

This repository comes with a set of test files to verify the plugin's functionality.

To run the tests:

```bash
npm test
```

This command will:
- Build the latest version of the plugin from source.
- Create a `test_result` directory.
- Copy the sample files from the `tests/` directory into it.
- Run the Prettier formatter on the files inside `test_result/`.

You can then compare the original files in `tests/` with the formatted files in `test_result/` to see the plugin in action. For example, `tests/messy.txt` will be cleaned up, while `tests/error.txt` (which contains a syntax error) will remain untouched.

> **Note**: The test files use a `.txt` extension to prevent editors from automatically formatting them. The test script tells Prettier to treat these `.txt` files as Go code.

## Publishing to NPM

This package is configured to build automatically before publishing.

1.  Update the version number in `package.json` using `npm version <patch|minor|major>`.
2.  Run `npm publish`.

The `prepublishOnly` script will handle building the Wasm and JavaScript bundles before the package is uploaded to the registry.

## How it Works

1.  The core formatting logic from Go's standard library (`go/format`) is compiled into a WebAssembly (`.wasm`) file.
2.  The `wasm_exec.js` script provided by Go is used to load and run the WASM module in Node.js.
3.  This Prettier plugin loads the WASM module and exposes the Go formatting function to Prettier's printing process.
4.  When Prettier processes a `.go` file, this plugin passes the code to the WASM module, which formats it and returns the result.

This approach ensures that the formatting is identical to what `gofmt` would produce, without needing a Go installation on the machine running the formatter.
