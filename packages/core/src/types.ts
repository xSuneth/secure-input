export interface SecureInputConfig {
  /** Custom encryption key (32 bytes). If not provided, a random key is generated. */
  key?: Uint8Array;
  /** Callback when encryption completes */
  onEncrypt?: (encrypted: string) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Enable debug logging */
  debug?: boolean;
}

export interface EncryptionMessage {
  type: "encrypt" | "decrypt" | "init";
  id: string;
  payload?: {
    value?: string;
    encrypted?: string;
    key?: Uint8Array;
  };
}

export interface EncryptionResponse {
  id: string;
  success: boolean;
  result?: string;
  error?: string;
}
