// AES-256-GCM encryption with salt for multi-layer security

const ENCRYPTION_KEY = 'selfX-secure-key-2024';
const SALT_ROUNDS = 3; // Multiple layers of encryption
const SELFX_SIGNATURE = 'SELFX_BACKUP_V2'; // Signature untuk validasi
const SELFX_SHARE_SIGNATURE = 'SELFX_SHARE_V1'; // Signature untuk shared post

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptOnce(data: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as unknown as ArrayBuffer },
    key,
    encoder.encode(data)
  );

  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  // Use Array.from to avoid stack overflow with large arrays
  const binaryString = Array.from(combined, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
}

async function decryptOnce(encryptedData: string, password: string): Promise<string> {
  const decoder = new TextDecoder();
  const binaryString = atob(encryptedData);
  const combined = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    combined[i] = binaryString.charCodeAt(i);
  }

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);

  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv as unknown as ArrayBuffer },
    key,
    data
  );

  return decoder.decode(decrypted);
}

// Multi-layer encryption with salt
export async function encrypt(data: string): Promise<string> {
  let result = data;
  for (let i = 0; i < SALT_ROUNDS; i++) {
    const layerKey = `${ENCRYPTION_KEY}-layer-${i}`;
    result = await encryptOnce(result, layerKey);
  }
  return result;
}

// Multi-layer decryption
export async function decrypt(encryptedData: string): Promise<string> {
  let result = encryptedData;
  for (let i = SALT_ROUNDS - 1; i >= 0; i--) {
    const layerKey = `${ENCRYPTION_KEY}-layer-${i}`;
    result = await decryptOnce(result, layerKey);
  }
  return result;
}

// Encrypt any object - with size limit check and signature
export async function encryptData<T>(data: T): Promise<string> {
  // Add selfX signature to data
  const dataWithSignature = {
    signature: SELFX_SIGNATURE,
    data: data
  };
  
  const jsonString = JSON.stringify(dataWithSignature);
  
  // Check data size to prevent stack overflow
  if (jsonString.length > 1000000) { // 1MB limit
    throw new Error('Data too large for encryption');
  }
  
  return encrypt(jsonString);
}

// Encrypt shared post with signature
export async function encryptSharedData<T>(data: T): Promise<string> {
  // Add selfX share signature to data
  const dataWithSignature = {
    signature: SELFX_SHARE_SIGNATURE,
    data: data
  };
  
  const jsonString = JSON.stringify(dataWithSignature);
  
  // Check data size to prevent stack overflow
  if (jsonString.length > 500000) { // 500KB limit for shared posts
    throw new Error('Shared data too large');
  }
  
  return encrypt(jsonString);
}

// Decrypt shared post with signature validation
export async function decryptSharedData<T>(encryptedData: string): Promise<T> {
  const jsonString = await decrypt(encryptedData);
  const parsed = JSON.parse(jsonString);
  
  // Validate selfX share signature
  if (!parsed.signature || parsed.signature !== SELFX_SHARE_SIGNATURE) {
    throw new Error('Invalid selfX shared post');
  }
  
  return parsed.data as T;
}

// Decrypt to object with signature validation
export async function decryptData<T>(encryptedData: string): Promise<T> {
  const jsonString = await decrypt(encryptedData);
  const parsed = JSON.parse(jsonString);
  
  // Validate selfX signature
  if (!parsed.signature || parsed.signature !== SELFX_SIGNATURE) {
    throw new Error('Invalid selfX backup file');
  }
  
  return parsed.data as T;
}
