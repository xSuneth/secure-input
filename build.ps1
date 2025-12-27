#!/usr/bin/env pwsh
# Build script for secure-input library
# Ensures packages are built in the correct order

Write-Host "`n🏗️  Building Secure Input Library" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Build WASM package
Write-Host "1️⃣  Building WASM package..." -ForegroundColor Yellow
Set-Location packages\wasm

if (!(Test-Path "pkg")) {
    New-Item -ItemType Directory -Path "pkg" -Force | Out-Null
}

try {
    wasm-pack build --target web --out-dir pkg --release
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ WASM build failed" -ForegroundColor Red
        Set-Location ..\..
        exit 1
    }
    Write-Host "✅ WASM package built successfully`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..

# Step 2: Build core package
Write-Host "2️⃣  Building core package..." -ForegroundColor Yellow
Set-Location packages\core

try {
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Core build failed" -ForegroundColor Red
        Set-Location ..\..
        exit 1
    }
    Write-Host "✅ Core package built successfully`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..

# Step 3: Build React package
Write-Host "3️⃣  Building React package..." -ForegroundColor Yellow
Set-Location packages\react

try {
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ React build failed" -ForegroundColor Red
        Set-Location ..\..
        exit 1
    }
    Write-Host "✅ React package built successfully`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Set-Location ..\..

Write-Host "`n🎉 All packages built successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  • Run a demo:  cd packages\examples\react-demo && pnpm dev" -ForegroundColor White
Write-Host "  • Run tests:   pnpm test" -ForegroundColor White
Write-Host "  • Publish:     pnpm changeset && pnpm release`n" -ForegroundColor White
