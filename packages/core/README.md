# @secure-input/core

Framework-agnostic input obfuscation library with WASM encryption.

## Installation

```bash
npm install @secure-input/core
```

## Usage

```typescript
import { SecureInput } from "@secure-input/core";

// Create instance
const secureInput = new SecureInput({
  onEncrypt: (encrypted) => {
    console.log("Encrypted:", encrypted);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
  debug: true,
});

// Encrypt a value
const encrypted = await secureInput.encrypt("COUPON2024");

// Decrypt a value
const decrypted = await secureInput.decrypt(encrypted);

// Clean up
secureInput.destroy();
```

## API

### `new SecureInput(config?)`

Create a new SecureInput instance.

**Config options:**

- `key?: Uint8Array` - Custom 32-byte encryption key (optional, random generated if not provided)
- `onEncrypt?: (encrypted: string) => void` - Callback when encryption completes
- `onError?: (error: Error) => void` - Error handler
- `debug?: boolean` - Enable debug logging

### `encrypt(value: string): Promise<string>`

Encrypt a string value. Returns base64-encoded ciphertext.

### `decrypt(encrypted: string): Promise<string>`

Decrypt a base64-encoded ciphertext.

### `destroy(): void`

Terminate the worker and clean up resources.

## Size

~15KB gzipped (including worker)
