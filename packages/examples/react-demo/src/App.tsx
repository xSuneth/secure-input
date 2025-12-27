import { useState } from "react";
import { SecureInput } from "@secure-input/react";
import "./App.css";

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEncryptedSubmit = async (encrypted: string) => {
    setIsLoading(true);
    setResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Encrypted value:", encrypted);
    setResult(encrypted);
    setIsLoading(false);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🔐 Secure Input Demo</h1>
        <p className="subtitle">React + WASM Encryption</p>

        <div className="card">
          <h2>Enter Coupon Code</h2>
          <SecureInput
            placeholder="Enter your coupon code..."
            onEncryptedSubmit={handleEncryptedSubmit}
            showStatus={true}
            inputProps={{
              style: {
                fontSize: "16px",
                padding: "14px",
              },
            }}
          />
        </div>

        {isLoading && (
          <div className="result-card loading">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        )}

        {result && !isLoading && (
          <div className="result-card">
            <h3>✅ Encrypted Successfully!</h3>
            <p className="info">
              In production, this encrypted value would be sent to your server.
            </p>
            <div className="encrypted-value">
              <strong>Encrypted Value:</strong>
              <code>{result}</code>
            </div>
          </div>
        )}

        <div className="info-card">
          <h3>How it works:</h3>
          <ul>
            <li>✅ Input is encrypted using ChaCha20Poly1305 in WASM</li>
            <li>✅ Encryption happens in a Web Worker (isolated thread)</li>
            <li>✅ Extensions can't read the plain text value</li>
            <li>✅ Only encrypted data leaves the component</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
