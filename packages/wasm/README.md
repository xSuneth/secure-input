# @secure-input/wasm

WebAssembly encryption module for the secure-input library.

Uses ChaCha20Poly1305 authenticated encryption compiled from Rust to WASM for maximum performance and security.

## Size

~10KB gzipped

## Usage

This package is typically not used directly. It's a dependency of `@secure-input/core`.

## Build

Requires Rust and wasm-pack:

```bash
cargo install wasm-pack
pnpm build
```
