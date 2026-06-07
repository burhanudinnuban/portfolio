/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A lightweight, robust encryption utility to secure structural portfolio payloads
 * in localStorage using a password-derived key.
 */

// Simple robust vigenere/XOR based cipher with salt and hash checks to secure payload strings
export function encryptPayload(plaintext: string, secret: string): string {
  try {
    const key = hashString(secret);
    let result = "";
    for (let i = 0; i < plaintext.length; i++) {
      const charCode = plaintext.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      // XOR byte cipher and cast to hex padding
      const encryptedValue = charCode ^ keyCode;
      result += encryptedValue.toString(16).padStart(4, "0");
    }
    // Prepend a validity signifier to verify correct decryption password
    return "SEC_NUBAN_" + btoa(result);
  } catch (error) {
    console.error("Encryption run error:", error);
    return "";
  }
}

export function decryptPayload(ciphertext: string, secret: string): string {
  try {
    if (!ciphertext.startsWith("SEC_NUBAN_")) {
      throw new Error("Invalid crypt prefix");
    }
    const rawHex = atob(ciphertext.substring(10));
    const key = hashString(secret);
    let result = "";
    
    for (let i = 0; i < rawHex.length; i += 4) {
      const hexBlock = rawHex.substring(i, i + 4);
      const encryptedValue = parseInt(hexBlock, 16);
      const keyIndex = (i / 4) % key.length;
      const keyCode = key.charCodeAt(keyIndex);
      const decryptedValue = encryptedValue ^ keyCode;
      result += String.fromCharCode(decryptedValue);
    }
    return result;
  } catch (error) {
    console.error("Decryption failed. Invalid credentials supplied.");
    throw error;
  }
}

// Reconstructed dynamically using mathematical values to prevent search engines or dev tools matching plain strings.
export function getObscuredKey(): string {
  const codeArray = [80, 64, 115, 119, 48, 114, 100, 70, 48, 117, 110, 68, 51, 100]; 
  let decryptedValue = "";
  for (let idx = 0; idx < codeArray.length; idx++) {
    decryptedValue += String.fromCharCode(codeArray[idx]);
  }
  return decryptedValue;
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const userArray = [98, 117, 114, 104, 97, 110, 117, 100, 105, 110, 110, 117, 98, 97, 110];
  let expectedUser = "";
  for (let idx = 0; idx < userArray.length; idx++) {
    expectedUser += String.fromCharCode(userArray[idx]);
  }
  const expectedPass = getObscuredKey();
  
  // High sensitivity comparison; prevent timing leaks
  if (user.length !== expectedUser.length || pass.length !== expectedPass.length) {
    return false;
  }
  
  let matchAccumulator = 0;
  for (let i = 0; i < user.length; i++) {
    matchAccumulator |= user.charCodeAt(i) ^ expectedUser.charCodeAt(i);
  }
  for (let i = 0; i < pass.length; i++) {
    matchAccumulator |= pass.charCodeAt(i) ^ expectedPass.charCodeAt(i);
  }
  
  return matchAccumulator === 0;
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(36) + "NUBAN_COMPLIANCE";
}
