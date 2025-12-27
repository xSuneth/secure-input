# 🚀 Secure Input Library - Setup Guide

A lightweight, WASM-powered input obfuscation library to protect sensitive data from browser extensions and client-side scraping.

## 📦 What Was Built

### Packages

- **@secure-input/wasm** - Rust-based ChaCha20Poly1305 encryption compiled to WASM (~10KB)
- **@secure-input/core** - Framework-agnostic JS library with Web Worker (~15KB)
- **@secure-input/react** - React hooks and components (~5KB)

**Total Size: ~30KB gzipped**

## 🛠️ Prerequisites

Before building, install:

1. **Node.js 18+** and **pnpm**

   ```bash
   npm install -g pnpm
   ```

2. **Rust** and **wasm-pack**

   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

   # Add WASM target
   rustup target add wasm32-unknown-unknown

   # Install wasm-pack
   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
   ```

## 📥 Installation & Build

```bash
# 1. Install dependencies
pnpm install

# 2. Build WASM package first
cd packages/wasm
pnpm build
cd ../..

# 3. Build all packages
pnpm build

# 4. Run example apps
cd packages/examples/react-demo
pnpm dev
# Open http://localhost:5173
```

## 🎯 Usage Examples

### React

```tsx
import { SecureInput } from "@secure-input/react";

function CouponForm() {
  const handleSubmit = async (encrypted: string) => {
    await fetch("/api/validate", {
      method: "POST",
      body: encrypted,
    });
  };

  return <SecureInput onEncryptedSubmit={handleSubmit} />;
}
```

### Vanilla JavaScript

```javascript
import { SecureInput } from "@secure-input/core";

const secureInput = new SecureInput();
await secureInput.initialize();

const encrypted = await secureInput.encrypt("COUPON2024");
console.log(encrypted); // Base64 encrypted string

secureInput.destroy(); // Cleanup
```

## 📤 Publishing to NPM

### First Time Setup

1. **Create NPM account** at https://www.npmjs.com
2. **Login locally**:

   ```bash
   npm login
   ```

3. **Update package.json files** with your details:
   - `author` field in each package
   - `repository.url` in each package

### Publishing Process

```bash
# 1. Build all packages
pnpm build

# 2. Create changeset (describes changes)
pnpm changeset
# Select packages to publish
# Choose version bump (major/minor/patch)
# Write description

# 3. Update versions
pnpm changeset version

# 4. Install to update lockfile
pnpm install

# 5. Publish to NPM
pnpm release
```

### Automated Publishing (GitHub Actions)

The repo includes CI/CD workflows:

1. **Push to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Add NPM token to GitHub**:

   - Generate token at https://www.npmjs.com/settings/tokens
   - Add as `NPM_TOKEN` secret in GitHub repo settings

3. **Auto-publish**: Push to `main` branch triggers publish workflow

## 🧪 Testing Locally

### Test in Vanilla JS:

```bash
cd packages/examples/vanilla-demo
pnpm dev
```

### Test in React:

```bash
cd packages/examples/react-demo
pnpm dev
```

## 🔧 Server-Side Decryption

You'll need to decrypt on your server. Example in Node.js:

```javascript
// Install: npm install @noble/ciphers
import { chacha20poly1305 } from "@noble/ciphers/chacha";

function decryptValue(encryptedBase64, key) {
  const data = Buffer.from(encryptedBase64, "base64");
  const nonce = data.slice(0, 12);
  const ciphertext = data.slice(12);

  const cipher = chacha20poly1305(key, nonce);
  const plaintext = cipher.decrypt(ciphertext);

  return Buffer.from(plaintext).toString("utf8");
}

// Use in API route
app.post("/api/validate", (req, res) => {
  const encrypted = req.body;
  const key = getKeyForUser(); // Store keys per session/user
  const couponCode = decryptValue(encrypted, key);

  // Validate coupon...
});
```

## 📊 Package Sizes

Run after building:

```bash
# Check sizes
du -sh packages/*/dist

# Or use bundlephobia
npx bundlephobia@latest @secure-input/core
```

## 🐛 Common Issues

**Issue: WASM build fails**

- Ensure Rust and wasm-pack are installed
- Run `rustup update`

**Issue: Worker not loading in dev**

- Vite handles workers automatically with `?worker` suffix
- Check browser console for CORS errors

**Issue: Build fails with TypeScript errors**

- Run `pnpm install` to ensure all deps are installed
- Check that all packages built in correct order (wasm → core → react)

## 📝 Next Steps

1. **Customize encryption**: Modify `packages/wasm/src/lib.rs` for different algorithms
2. **Add more frameworks**: Create Vue/Svelte/Angular wrappers
3. **Server adapters**: Add `@secure-input/server` package for Next.js/Express helpers
4. **Documentation site**: Use VitePress or Docusaurus

## 🔒 Security Notes

- This provides **obfuscation**, not absolute security
- Always validate server-side with rate limiting
- Use HTTPS in production
- Rotate encryption keys periodically
- Consider using session-specific keys

## 📞 Support

Open an issue on GitHub or check the docs in each package's README.

---

**Ready to protect your inputs! 🛡️**
