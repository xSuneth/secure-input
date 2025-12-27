import { useEffect, useRef, useState, useCallback } from "react";
import { SecureInput as CoreSecureInput } from "@secure-input/core";
import type { SecureInputConfig } from "@secure-input/core";

export interface UseSecureInputOptions
  extends Omit<SecureInputConfig, "onEncrypt" | "onError"> {
  /** Auto-initialize on mount (default: true) */
  autoInit?: boolean;
}

export interface UseSecureInputReturn {
  /** Encrypt a value */
  encrypt: (value: string) => Promise<string>;
  /** Decrypt an encrypted value */
  decrypt: (encrypted: string) => Promise<string>;
  /** Whether the secure input is initialized */
  isReady: boolean;
  /** Latest encrypted value */
  encryptedValue: string | null;
  /** Error if encryption failed */
  error: Error | null;
  /** Manually initialize (if autoInit is false) */
  initialize: () => Promise<void>;
}

/**
 * React hook for using SecureInput
 */
export function useSecureInput(
  options: UseSecureInputOptions = {}
): UseSecureInputReturn {
  const { autoInit = true, ...coreConfig } = options;

  const secureInputRef = useRef<CoreSecureInput | null>(null);
  const initializedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [encryptedValue, setEncryptedValue] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async () => {
    // Only create the instance once
    if (!secureInputRef.current) {
      secureInputRef.current = new CoreSecureInput({
        ...coreConfig,
        onEncrypt: (encrypted) => {
          setEncryptedValue(encrypted);
          setError(null);
        },
        onError: (err) => {
          setError(err);
        },
      });
    }

    // Only initialize once
    if (initializedRef.current) {
      return;
    }

    try {
      await secureInputRef.current.initialize();
      initializedRef.current = true;
      setIsReady(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []); // Empty deps - only create once

  const encrypt = useCallback(async (value: string): Promise<string> => {
    if (!secureInputRef.current) {
      throw new Error("SecureInput not initialized");
    }
    try {
      const encrypted = await secureInputRef.current.encrypt(value);
      setEncryptedValue(encrypted);
      setError(null);
      return encrypted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, []);

  const decrypt = useCallback(async (encrypted: string): Promise<string> => {
    if (!secureInputRef.current) {
      throw new Error("SecureInput not initialized");
    }
    try {
      const decrypted = await secureInputRef.current.decrypt(encrypted);
      setError(null);
      return decrypted;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    if (autoInit && !initializedRef.current && mounted) {
      initialize();
    }

    return () => {
      mounted = false;
      // Don't destroy immediately - wait a bit to handle React Strict Mode
      // In production, this happens immediately. In dev, prevents recreation.
      const timeoutId = setTimeout(() => {
        if (secureInputRef.current) {
          secureInputRef.current.destroy();
          secureInputRef.current = null;
          initializedRef.current = false;
        }
      }, 100);

      // Clean up the timeout directly in the cleanup function
      clearTimeout(timeoutId);
    };
  }, [autoInit, initialize]);

  return {
    encrypt,
    decrypt,
    isReady,
    encryptedValue,
    error,
    initialize,
  };
}
