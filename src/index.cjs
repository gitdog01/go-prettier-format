/**
 * @fileoverview Go Prettier Format Plugin (CommonJS)
 * A Prettier plugin for formatting Go code using WebAssembly.
 * This plugin leverages Go's native formatting capabilities through WASM.
 * This is the CommonJS version for compatibility with older Node.js environments.
 */

"use strict";

const fs = require("fs");
const path = require("path");

/** @type {Promise<void>|null} */
let initializePromise;

/**
 * Initializes the Go WebAssembly module for formatting Go code.
 * This function sets up the WASM runtime and makes the formatGo function
 * available on the global object.
 * 
 * @async
 * @function initialize
 * @returns {Promise<void>} A promise that resolves when the WASM module is ready
 * @throws {Error} If the WASM file cannot be loaded or instantiated
 */
function initialize() {
  if (initializePromise) {
    return initializePromise;
  }

  initializePromise = (async () => {
    // wasm_exec.js is a file provided by the Go compiler that needs to be
    // loaded to run the WASM file. It creates a `Go` class on the global object.
    require("./wasm_exec.js");

    const go = new Go();

    const wasmPath = path.join(__dirname, "../go.wasm");
    const wasmBuffer = fs.readFileSync(wasmPath);

    const { instance } = await WebAssembly.instantiate(
      wasmBuffer,
      go.importObject
    );

    // go.run returns a promise that resolves when the go program exits.
    // Since our program is a long-running service (it exposes a function and waits),
    // we don't await it.
    go.run(instance);

    // The `formatGo` function is now available on the global object.
  })();

  return initializePromise;
}

/**
 * Prettier language configuration for Go.
 * Defines the language settings, file extensions, and parser mappings.
 * 
 * @type {Array<Object>}
 * @property {string} name - The display name of the language
 * @property {string[]} parsers - Array of parser names for this language
 * @property {string[]} extensions - File extensions associated with this language
 * @property {string[]} vscodeLanguageIds - VSCode language identifier mappings
 */
const languages = [
  {
    name: "Go",
    parsers: ["go"],
    extensions: [".go"],
    vscodeLanguageIds: ["go"],
  },
];

/**
 * Prettier parser configuration for Go.
 * Defines how Go source code should be parsed and processed.
 * 
 * @type {Object<string, Object>}
 * @property {Object} go - Go language parser configuration
 * @property {Function} go.parse - Parser function that returns the input text as-is
 * @property {string} go.astFormat - AST format identifier for the printer
 * @property {Function} go.locStart - Function to get the start location of a node
 * @property {Function} go.locEnd - Function to get the end location of a node
 */
const parsers = {
  go: {
    /**
     * Parse Go source code. For this plugin, we pass through the text as-is
     * since the actual formatting is handled by the Go WASM module.
     * 
     * @param {string} text - The Go source code to parse
     * @returns {string} The input text unchanged
     */
    parse: (text) => text,
    astFormat: "go-format",
    // These are required for Prettier to work
    /**
     * Get the start location of a node in the source code.
     * 
     * @param {string} node - The node (in this case, the source text)
     * @returns {number} Always returns 0 as we treat the entire text as one node
     */
    locStart: (node) => 0,
    /**
     * Get the end location of a node in the source code.
     * 
     * @param {string} node - The node (in this case, the source text)
     * @returns {number} The length of the text
     */
    locEnd: (node) => node.length,
  },
};

/**
 * Prettier printer configuration for Go.
 * Defines how the parsed Go AST should be formatted back to text.
 * 
 * @type {Object<string, Object>}
 * @property {Object} go-format - Go formatting printer configuration
 * @property {Function} go-format.print - Async function that formats Go code
 */
const printers = {
  "go-format": {
    /**
     * Format Go source code using the WebAssembly Go formatter.
     * This function initializes the WASM module if needed and calls the
     * global formatGo function exposed by the Go program.
     * 
     * @async
     * @param {Object} path - Prettier's path object containing the source code
     * @param {Function} path.getValue - Function to get the current node value
     * @returns {Promise<string>} The formatted Go source code
     * @throws {Error} If the WASM module fails to initialize or format the code
     */
    print: async (path) => {
      // The WASM module must be initialized before we can format.
      await initialize();
      const text = path.getValue();
      // The `formatGo` function is exposed on the global object by our Go program.
      return global.formatGo(text);
    },
  },
};

/**
 * @module go-prettier-format
 * @description Prettier plugin for formatting Go source code using WebAssembly
 * @exports {Object} languages - Language configuration for Prettier
 * @exports {Object} parsers - Parser configuration for Go language
 * @exports {Object} printers - Printer configuration for Go formatting
 */
module.exports = {
  languages,
  parsers,
  printers,
}; 