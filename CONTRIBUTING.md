# Contributing to go-prettier-format

First off, thank you for considering contributing! Your help is appreciated.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please make sure to include the following:
- A clear and descriptive title.
- Steps to reproduce the bug.
- The expected behavior and what happened instead.
- Your environment details (Node.js version, OS, etc.).

Please check the existing issues to see if a similar bug has already been reported.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement, feel free to open an issue to discuss it. This lets us coordinate our efforts and prevent duplication of work.

### Pull Requests

We welcome pull requests! For major changes, please open an issue first to discuss what you would like to change.

When submitting a pull request, please make sure to:
- Update the `README.md` if any user-facing changes were made.
- Ensure the tests pass (`npm test`).
- Follow the existing code style.

## Development Setup

To get your development environment set up, please follow these steps. You will need to have Go installed to build the WebAssembly module.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/gitdog01/go-prettier-format.git
    cd go-prettier-format
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the project:**
    The project needs to be built before you can test your changes. This includes compiling the Go source to WASM and bundling the JavaScript.
    ```bash
    npm run build
    ```

4.  **Run tests:**
    To make sure everything is working correctly, run the test suite:
    ```bash
    npm test
    ``` 