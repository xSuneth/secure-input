# 🔐 Secure Input

[![npm version](https://badge.fury.io/js/@secure-input%2Fcore.svg)](https://www.npmjs.com/package/@secure-input/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**WASM-powered input obfuscation library for preventing client-side scraping**

A lightweight, framework-agnostic library that uses WebAssembly encryption and Web Workers to protect sensitive input data (like coupon codes) from browser extensions and client-side scrapers.

## 🚨 Security Notice

This library provides **obfuscation**, not absolute security. It raises the bar against automated scrapers and basic extensions, but determined attackers with deep technical knowledge can still potentially extract data. **Always implement server-side validation and rate limiting** as your primary defense.

## 📦 Packages

- [`@secure-input/core`](https://www.npmjs.com/package/@secure-input/core) - Framework-agnostic core library (~15KB gzipped)
- [`@secure-input/react`](https://www.npmjs.com/package/@secure-input/react) - React hooks and components (~5KB gzipped)
- [`@secure-input/wasm`](https://www.npmjs.com/package/@secure-input/wasm) - WASM encryption module (~10KB gzipped)

**Total size: ~30KB gzipped**

## ✨ Features

- ✅ **WASM-based encryption** - Hard to reverse-engineer compared to plain JavaScript
- ✅ **Web Worker isolation** - Sensitive processing happens in separate thread
- ✅ **Framework-agnostic** - Works with vanilla JS, React, Vue, etc.
- ✅ **Lightweight** - Only ~30KB gzipped total
- ✅ **TypeScript** - Full type safety
- ✅ **Zero dependencies** - Core has no runtime dependencies

## 🚀 Quick Start

### React

```bash
npm install @secure-input/react
# or
pnpm add @secure-input/react
```

```tsx
import { SecureInput } from "@secure-input/react";

function CouponForm() {
  const handleSubmit = async (encryptedValue: Uint8Array) => {
    // Send encrypted value to your server
    await fetch("/api/validate", {
      method: "POST",
      body: encryptedValue,
    });
  };

  return <SecureInput onEncryptedSubmit={handleSubmit} />;
}
```

### Vanilla JavaScript

```bash
npm install @secure-input/core
```

```javascript
import { SecureInput } from "@secure-input/core";

const secureInput = new SecureInput({
  element: document.querySelector("#coupon-input"),
  onEncrypt: (encrypted) => {
    console.log("Encrypted value:", encrypted);
  },
});

// Cleanup when done
secureInput.destroy();
```

## 🏗️ How It Works

1. User types in input field
2. Each keystroke is immediately captured by JavaScript
3. Value is sent to Web Worker (isolated context)
4. Worker uses WASM module to encrypt the value
5. Only encrypted data is accessible to extensions
6. Plain text never exists in the main thread or DOM

## 🛡️ What This Protects Against

- ✅ Basic browser extension scrapers
- ✅ DOM inspection tools
- ✅ Simple JavaScript injection
- ✅ Automated bots reading input values

## ⚠️ What This Does NOT Protect Against

- ❌ Keylogger extensions (they capture before your code runs)
- ❌ Screenshot/pixel analysis
- ❌ Network traffic inspection
- ❌ Determined attackers with reverse-engineering skills

**Bottom line**: This makes scraping annoying enough that basic bots give up. It's not military-grade encryption.

## 📖 Documentation

Coming soon...

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT © 2025

## ⚡ Browser Support

- Chrome 57+ (WASM support)
- Firefox 52+
- Safari 11+
- Edge 16+

Modern browsers with WebAssembly and Web Worker support.
