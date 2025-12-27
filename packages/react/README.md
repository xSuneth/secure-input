# @secure-input/react

React hooks and components for the secure-input library.

## Installation

```bash
npm install @secure-input/react
```

## Usage

### SecureInput Component

```tsx
import { SecureInput } from "@secure-input/react";

function CouponForm() {
  const handleSubmit = async (encryptedValue: string) => {
    // Send encrypted value to server
    const response = await fetch("/api/validate-coupon", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: encryptedValue,
    });

    const result = await response.json();
    console.log("Coupon valid:", result.valid);
  };

  return (
    <SecureInput
      placeholder="Enter coupon code"
      onEncryptedSubmit={handleSubmit}
      showStatus={true}
    />
  );
}
```

### useSecureInput Hook

```tsx
import { useSecureInput } from "@secure-input/react";
import { useState } from "react";

function CustomForm() {
  const [input, setInput] = useState("");
  const { encrypt, isReady, error } = useSecureInput();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReady) {
      const encrypted = await encrypt(input);
      console.log("Encrypted:", encrypted);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={!isReady}
      />
      <button type="submit" disabled={!isReady}>
        Submit
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

## API

### `<SecureInput>` Component

**Props:**

- `onEncryptedSubmit?: (encrypted: string) => void | Promise<void>` - Called when form is submitted with encrypted value
- `onChange?: (value: string) => void` - Called when input changes (plain text)
- `placeholder?: string` - Input placeholder text
- `className?: string` - CSS class name
- `name?: string` - Input name attribute
- `showStatus?: boolean` - Show encryption status (default: true)
- `inputProps?: React.InputHTMLAttributes<HTMLInputElement>` - Additional input props
- All `UseSecureInputOptions`

### `useSecureInput(options?)` Hook

**Options:**

- `autoInit?: boolean` - Auto-initialize on mount (default: true)
- `key?: Uint8Array` - Custom encryption key
- `debug?: boolean` - Enable debug logging

**Returns:**

- `encrypt: (value: string) => Promise<string>` - Encrypt a value
- `decrypt: (encrypted: string) => Promise<string>` - Decrypt a value
- `isReady: boolean` - Whether encryption is ready
- `encryptedValue: string | null` - Latest encrypted value
- `error: Error | null` - Latest error
- `initialize: () => Promise<void>` - Manually initialize

## Size

~5KB gzipped (excluding dependencies)
