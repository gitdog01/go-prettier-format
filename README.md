# Prettier Plugin for Go (using WASM)

This is a Prettier plugin for the Go programming language. It formats Go code using the official `go/format` package, which is compiled to WebAssembly (WASM) to run in a Node.js environment.

## Background

As web developers, we love the consistent code style that Prettier brings to our projects. However, when working on projects that involve Go - for instance, a Go backend with a JavaScript frontend, or writing Go code in a web-based editor - the ability to format Go code with the same familiar tool was missing.

This project was born out of the desire to have a single, unified formatting toolchain. Instead of relying on external `gofmt` binaries, which can be brittle to manage in a Node.js-based development environment, this plugin leverages the power of WebAssembly. We compile Go's own formatting tools into a WASM module, allowing you to format Go code directly within your JavaScript-based tools, ensuring speed, portability, and consistency.

## Usage

First, install Prettier and this plugin:

```bash
npm install --save-dev prettier prettier-plugin-go
```

Then, you can run Prettier from the command line:

```bash
# Format a specific file
npx prettier --write your-file.go

# Format all .go files in the project
npx prettier --write "**/*.go"
```

You can also add a script to your `package.json` for convenience:

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.go\""
  }
}
```

### Editor Integration

Once installed, Prettier-compatible editors (like VS Code with the Prettier extension) should automatically pick up the plugin and use it to format `.go` files on save.

## How it Works

1.  The core formatting logic from Go's standard library (`go/format`) is compiled into a WebAssembly (`.wasm`) file.
2.  The `wasm_exec.js` script provided by Go is used to load and run the WASM module in Node.js.
3.  This Prettier plugin loads the WASM module and exposes the Go formatting function to Prettier's printing process.
4.  When Prettier processes a `.go` file, this plugin passes the code to the WASM module, which formats it and returns the result.

This approach ensures that the formatting is identical to what `gofmt` would produce, without needing a Go installation on the machine running the formatter.
