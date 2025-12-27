# Quick Start Script for Secure Input Library
# This script helps you get started quickly

Write-Host "🔐 Secure Input Library - Quick Start" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check pnpm
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  pnpm not found. Installing..." -ForegroundColor Yellow
    npm install -g pnpm
    Write-Host "✅ pnpm installed" -ForegroundColor Green
}

# Check Rust
try {
    $rustVersion = rustc --version
    Write-Host "✅ Rust: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Rust not found. Please install from https://rustup.rs" -ForegroundColor Red
    Write-Host "   Run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh" -ForegroundColor Yellow
    exit 1
}

# Check wasm-pack
try {
    $wasmPackVersion = wasm-pack --version
    Write-Host "✅ wasm-pack: $wasmPackVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  wasm-pack not found. Installing..." -ForegroundColor Yellow
    cargo install wasm-pack
    Write-Host "✅ wasm-pack installed" -ForegroundColor Green
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "`n🦀 Building WASM package..." -ForegroundColor Yellow
Set-Location packages\wasm
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ WASM build failed" -ForegroundColor Red
    exit 1
}
Set-Location ..\..

Write-Host "`n🏗️  Building all packages..." -ForegroundColor Yellow
pnpm build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build complete! 🎉" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "  1. Try the React demo:   cd packages\examples\react-demo && pnpm dev" -ForegroundColor White
    Write-Host "  2. Try the Vanilla demo: cd packages\examples\vanilla-demo && pnpm dev" -ForegroundColor White
    Write-Host "  3. Read SETUP.md for publishing to NPM`n" -ForegroundColor White
} else {
    Write-Host "`n❌ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}
