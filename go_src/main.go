package main

import (
	"go/format"
	"syscall/js"
)

// formatGo wraps go/format.Source to be callable from JavaScript.
// It accepts Go source code as a string and returns the formatted code.
func formatGo(this js.Value, i []js.Value) interface{} {
	if len(i) == 0 {
		js.Global().Get("console").Call("error", "formatGo: missing code argument")
		return js.Null()
	}
	code := i[0].String()
	formatted, err := format.Source([]byte(code))
	if err != nil {
		// In case of a syntax error in the Go code, go/format returns an error.
		// Prettier expects the original text to be returned in case of an error.
		// We also log the error to the console for debugging purposes.
		js.Global().Get("console").Call("error", "Error formatting Go code:", err.Error())
		return js.ValueOf(code)
	}
	return js.ValueOf(string(formatted))
}

func main() {
	// Create a channel to keep the Go program running.
	// This is necessary because the WASM module would exit otherwise.
	c := make(chan struct{}, 0)

	// Expose the formatGo function to the JavaScript global scope.
	js.Global().Set("formatGo", js.FuncOf(formatGo))

	// Block forever
	<-c
}
