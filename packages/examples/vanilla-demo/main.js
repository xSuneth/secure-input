import { SecureInput } from "@secure-input/core";

const statusEl = document.getElementById("status");
const formEl = document.getElementById("coupon-form");
const inputEl = document.getElementById("coupon");
const submitBtn = document.getElementById("submit-btn");
const resultEl = document.getElementById("result");
const encryptedValueEl = document.getElementById("encrypted-value");

// Create SecureInput instance
const secureInput = new SecureInput({
  debug: true,
  onError: (error) => {
    console.error("SecureInput error:", error);
    updateStatus(`Error: ${error.message}`, "error");
  },
});

function updateStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

// Initialize
async function init() {
  try {
    updateStatus("Initializing encryption...", "info");
    await secureInput.initialize();
    updateStatus("🔒 Encryption ready! Enter your coupon code.", "success");
    inputEl.disabled = false;
    submitBtn.disabled = false;
  } catch (error) {
    updateStatus(`Initialization failed: ${error.message}`, "error");
  }
}

// Handle form submission
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const value = inputEl.value.trim();
  if (!value) {
    updateStatus("Please enter a coupon code", "error");
    return;
  }

  try {
    updateStatus("Encrypting...", "info");
    submitBtn.disabled = true;

    const encrypted = await secureInput.encrypt(value);

    // Show result
    encryptedValueEl.textContent = encrypted;
    resultEl.style.display = "block";

    updateStatus(
      "✅ Encrypted successfully! In production, this would be sent to your server.",
      "success"
    );

    // Simulate API call
    console.log("Would send to server:", encrypted);

    // Clear input
    inputEl.value = "";
  } catch (error) {
    updateStatus(`Encryption failed: ${error.message}`, "error");
  } finally {
    submitBtn.disabled = false;
  }
});

// Start initialization
init();
