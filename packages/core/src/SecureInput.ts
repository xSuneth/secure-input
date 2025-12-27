import type {
  SecureInputConfig,
  EncryptionMessage,
  EncryptionResponse,
} from "./types";
// @ts-ignore - Vite worker import
import CryptoWorker from "./worker/crypto.worker?worker&inline";

export class SecureInput {
  private worker: Worker;
  private config: SecureInputConfig;
  private pendingRequests: Map<
    string,
    {
      resolve: (value: string) => void;
      reject: (error: Error) => void;
    }
  >;
  private initialized: boolean = false;

  constructor(config: SecureInputConfig = {}) {
    this.config = config;
    this.pendingRequests = new Map();

    this.log("Creating worker...");

    try {
      // Create worker - Vite bundles this inline
      this.worker = new CryptoWorker();
      this.log("Worker created successfully");
    } catch (error) {
      this.log("Failed to create worker:", error);
      throw error;
    }

    // Handle worker messages
    this.worker.addEventListener(
      "message",
      this.handleWorkerMessage.bind(this)
    );

    // Handle worker errors
    this.worker.addEventListener("error", (error) => {
      const err = new Error(`Worker error: ${error.message}`);
      this.config.onError?.(err);
      this.log("Worker error:", error);
    });

    this.log("Worker event listeners attached");
  }

  /**
   * Initialize the encryption worker with a key
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.log("Initializing worker...");

    return new Promise((resolve, reject) => {
      const id = this.generateId();
      this.pendingRequests.set(id, {
        resolve: () => {
          this.initialized = true;
          this.log("Worker initialized successfully");
          resolve();
        },
        reject: (error) => {
          this.log("Worker initialization failed:", error);
          reject(error);
        },
      });

      const message: EncryptionMessage = {
        type: "init",
        id,
        payload: {
          key: this.config.key,
        },
      };

      this.log("Sending init message:", message);
      this.worker.postMessage(message);
    });
  }

  /**
   * Encrypt a value using the WASM module
   */
  async encrypt(value: string): Promise<string> {
    if (!this.initialized) {
      this.log("Not initialized, initializing now...");
      await this.initialize();
    }

    this.log("Encrypting value:", value);

    return new Promise((resolve, reject) => {
      const id = this.generateId();
      this.pendingRequests.set(id, { resolve, reject });

      const message: EncryptionMessage = {
        type: "encrypt",
        id,
        payload: { value },
      };

      this.log("Sending encrypt message:", message);
      this.worker.postMessage(message);
    });
  }

  /**
   * Decrypt an encrypted value
   */
  async decrypt(encrypted: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const id = this.generateId();
      this.pendingRequests.set(id, { resolve, reject });

      const message: EncryptionMessage = {
        type: "decrypt",
        id,
        payload: { encrypted },
      };

      this.worker.postMessage(message);
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.worker.terminate();
    this.pendingRequests.clear();
    this.initialized = false;
  }

  private handleWorkerMessage(event: MessageEvent<EncryptionResponse>): void {
    const { id, success, result, error } = event.data;

    this.log("Worker response:", { id, success, result, error });

    const request = this.pendingRequests.get(id);
    if (!request) {
      this.log("Received response for unknown request:", id);
      return;
    }

    this.pendingRequests.delete(id);

    if (success) {
      request.resolve(result || "");
      // Only call onEncrypt callback for encrypt operations (when result exists)
      if (result !== undefined && result !== "") {
        this.config.onEncrypt?.(result);
      }
    } else {
      const err = new Error(error || "Encryption failed");
      this.log("Error:", err);
      request.reject(err);
      this.config.onError?.(err);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log("[SecureInput]", ...args);
    }
  }
}
