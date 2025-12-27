import init, {
  generate_key,
  encrypt_value,
  decrypt_value,
} from "@secure-input/wasm";
import type { EncryptionMessage, EncryptionResponse } from "../types";

let initialized = false;
let encryptionKey: Uint8Array | null = null;

// Initialize WASM module
async function initializeWasm() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

// Handle messages from main thread
self.addEventListener(
  "message",
  async (event: MessageEvent<EncryptionMessage>) => {
    const { type, id, payload } = event.data;

    try {
      await initializeWasm();

      let response: EncryptionResponse;

      switch (type) {
        case "init":
          // Initialize with custom key or generate new one
          if (payload?.key && payload.key.length === 32) {
            encryptionKey = payload.key;
          } else {
            const keyArray = generate_key();
            encryptionKey = new Uint8Array(keyArray);
          }
          response = { id, success: true };
          break;

        case "encrypt":
          if (!encryptionKey) {
            throw new Error("Worker not initialized. Call init first.");
          }
          if (!payload?.value) {
            throw new Error("No value to encrypt");
          }
          const encrypted = encrypt_value(payload.value, encryptionKey);
          response = { id, success: true, result: encrypted };
          break;

        case "decrypt":
          if (!encryptionKey) {
            throw new Error("Worker not initialized. Call init first.");
          }
          if (!payload?.encrypted) {
            throw new Error("No encrypted value provided");
          }
          const decrypted = decrypt_value(payload.encrypted, encryptionKey);
          response = { id, success: true, result: decrypted };
          break;

        default:
          throw new Error(`Unknown message type: ${type}`);
      }

      self.postMessage(response);
    } catch (error) {
      const response: EncryptionResponse = {
        id,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
      self.postMessage(response);
    }
  }
);
