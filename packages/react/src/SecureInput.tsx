import React, {
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useSecureInput, type UseSecureInputOptions } from "./useSecureInput";

export interface SecureInputProps extends UseSecureInputOptions {
  /** Callback when encrypted value is submitted */
  onEncryptedSubmit?: (encrypted: string) => void | Promise<void>;
  /** Callback when plain text changes (for controlled component) */
  onChange?: (value: string) => void;
  /** Input placeholder */
  placeholder?: string;
  /** CSS class name */
  className?: string;
  /** Input name attribute */
  name?: string;
  /** Whether to show visual feedback for encrypted state */
  showStatus?: boolean;
  /** Custom input props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

/**
 * SecureInput component - encrypts user input before submission
 */
export function SecureInput({
  onEncryptedSubmit,
  onChange,
  placeholder = "Enter value...",
  className = "",
  name = "secure-input",
  showStatus = true,
  inputProps = {},
  ...secureInputOptions
}: SecureInputProps) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { encrypt, isReady, error } = useSecureInput(secureInputOptions);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (!isReady || !value) return;

      setIsSubmitting(true);
      try {
        const encrypted = await encrypt(value);
        await onEncryptedSubmit?.(encrypted);
        setValue(""); // Clear input after successful submission
      } catch (err) {
        console.error("Encryption failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isReady, value, encrypt, onEncryptedSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={!isReady || isSubmitting}
          {...inputProps}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            ...inputProps.style,
          }}
        />

        {showStatus && (
          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
              color: error ? "#dc2626" : isReady ? "#16a34a" : "#6b7280",
            }}
          >
            {error
              ? `Error: ${error.message}`
              : !isReady
              ? "Initializing..."
              : isSubmitting
              ? "Encrypting..."
              : "🔒 Encryption ready"}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!isReady || !value || isSubmitting}
        style={{
          marginTop: "8px",
          padding: "8px 16px",
          backgroundColor: isReady && value ? "#2563eb" : "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isReady && value ? "pointer" : "not-allowed",
          fontSize: "14px",
        }}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
