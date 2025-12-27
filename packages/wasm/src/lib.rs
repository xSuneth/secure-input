use chacha20poly1305::{
    aead::{Aead, KeyInit},
    ChaCha20Poly1305, Nonce, Key,
};
use wasm_bindgen::prelude::*;
use base64::{Engine as _, engine::general_purpose};

/// Generate a random 32-byte key for ChaCha20Poly1305
#[wasm_bindgen]
pub fn generate_key() -> Vec<u8> {
    let mut key_bytes = [0u8; 32];
    getrandom::getrandom(&mut key_bytes).expect("Failed to generate random key");
    key_bytes.to_vec()
}

/// Encrypt a string value using ChaCha20Poly1305
/// Returns base64-encoded ciphertext
#[wasm_bindgen]
pub fn encrypt_value(value: &str, key: &[u8]) -> Result<String, JsValue> {
    // Validate key length
    if key.len() != 32 {
        return Err(JsValue::from_str("Key must be 32 bytes"));
    }

    // Create cipher instance
    let cipher = ChaCha20Poly1305::new_from_slice(key)
        .map_err(|e| JsValue::from_str(&format!("Failed to create cipher: {}", e)))?;

    // Generate random nonce (12 bytes for ChaCha20Poly1305)
    let mut nonce_bytes = [0u8; 12];
    getrandom::getrandom(&mut nonce_bytes)
        .map_err(|e| JsValue::from_str(&format!("Failed to generate nonce: {}", e)))?;
    
    let nonce = Nonce::from_slice(&nonce_bytes);

    // Encrypt the value
    let ciphertext = cipher
        .encrypt(nonce, value.as_bytes())
        .map_err(|e| JsValue::from_str(&format!("Encryption failed: {}", e)))?;

    // Combine nonce + ciphertext and encode as base64
    let mut result = nonce_bytes.to_vec();
    result.extend_from_slice(&ciphertext);
    
    Ok(general_purpose::STANDARD.encode(&result))
}

/// Decrypt a base64-encoded ciphertext
#[wasm_bindgen]
pub fn decrypt_value(encrypted: &str, key: &[u8]) -> Result<String, JsValue> {
    // Validate key length
    if key.len() != 32 {
        return Err(JsValue::from_str("Key must be 32 bytes"));
    }

    // Decode base64
    let data = general_purpose::STANDARD.decode(encrypted)
        .map_err(|e| JsValue::from_str(&format!("Invalid base64: {}", e)))?;

    // Extract nonce (first 12 bytes) and ciphertext
    if data.len() < 12 {
        return Err(JsValue::from_str("Invalid encrypted data"));
    }

    let (nonce_bytes, ciphertext) = data.split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);

    // Create cipher and decrypt
    let cipher = ChaCha20Poly1305::new_from_slice(key)
        .map_err(|e| JsValue::from_str(&format!("Failed to create cipher: {}", e)))?;

    let plaintext = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|e| JsValue::from_str(&format!("Decryption failed: {}", e)))?;

    // Convert to string
    String::from_utf8(plaintext)
        .map_err(|e| JsValue::from_str(&format!("Invalid UTF-8: {}", e)))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt() {
        let key = generate_key();
        let original = "COUPON2024";
        
        let encrypted = encrypt_value(original, &key).unwrap();
        let decrypted = decrypt_value(&encrypted, &key).unwrap();
        
        assert_eq!(original, decrypted);
    }
}
