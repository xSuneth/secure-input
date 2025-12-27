#!/bin/bash
set -e

echo "🦀 Building WASM module..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack not found. Installing..."
    cargo install wasm-pack
fi

# Build with optimization
wasm-pack build --target web --out-dir pkg --release

# Optimize WASM binary further
if command -v wasm-opt &> /dev/null; then
    echo "🔧 Optimizing WASM binary with wasm-opt..."
    wasm-opt -Oz pkg/secure_input_wasm_bg.wasm -o pkg/secure_input_wasm_bg.wasm
fi

echo "✅ WASM build complete!"
echo "📦 Output: packages/wasm/pkg/"
