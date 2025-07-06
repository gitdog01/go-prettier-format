"use strict";

const fs = require("fs");
const path = require("path");

let initializePromise;

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

const languages = [
  {
    name: "Go",
    parsers: ["go"],
    extensions: [".go"],
    vscodeLanguageIds: ["go"],
  },
];

const parsers = {
  go: {
    parse: (text) => text,
    astFormat: "go-format",
    // These are required for Prettier to work
    locStart: (node) => 0,
    locEnd: (node) => node.length,
  },
};

const printers = {
  "go-format": {
    print: async (path) => {
      // The WASM module must be initialized before we can format.
      await initialize();
      const text = path.getValue();
      // The `formatGo` function is exposed on the global object by our Go program.
      return global.formatGo(text);
    },
  },
};

module.exports = {
  languages,
  parsers,
  printers,
}; 