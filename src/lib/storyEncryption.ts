// Story Encryption with AES-256-GCM and Multi-layer Salt
const SELFX_STORY_SIGNATURE = 'selfQ-story-encrypted-v2.0';
const ENCRYPTION_LAYERS = 3;

// Generate random salt
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Generate encryption key from password and salt
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
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data with AES-256-GCM
async function encryptLayer(data: string, password: string): Promise<{ encrypted: string; salt: string; iv: string }> {
  const salt = generateSalt();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);
  
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(data)
  );

  return {
    encrypted: Array.from(new Uint8Array(encrypted)).map(b => b.toString(16).padStart(2, '0')).join(''),
    salt: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''),
    iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('')
  };
}

// Decrypt data with AES-256-GCM
async function decryptLayer(encryptedHex: string, saltHex: string, ivHex: string, password: string): Promise<string> {
  const encrypted = new Uint8Array(encryptedHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  const iv = new Uint8Array(ivHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  
  const key = await deriveKey(password, salt);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encrypted
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Generate unique password for each layer
function generateLayerPassword(baseData: string, layer: number): string {
  return `selfQ-${layer}-${btoa(baseData.slice(0, 20))}-${Date.now().toString(36)}`;
}

// Encrypt story with multiple layers
export async function encryptStoryData(storyData: any): Promise<string> {
  try {
    // Add signature and timestamp
    const dataWithSignature = {
      ...storyData,
      signature: SELFX_STORY_SIGNATURE,
      encryptedAt: new Date().toISOString(),
      layers: ENCRYPTION_LAYERS
    };

    let currentData = JSON.stringify(dataWithSignature);
    const layerInfo: Array<{ salt: string; iv: string; passwordHint: string }> = [];

    // Apply multiple encryption layers
    for (let layer = 0; layer < ENCRYPTION_LAYERS; layer++) {
      const password = generateLayerPassword(currentData, layer);
      const encrypted = await encryptLayer(currentData, password);
      
      layerInfo.push({
        salt: encrypted.salt,
        iv: encrypted.iv,
        passwordHint: btoa(password).slice(0, 16) // Store hint for validation
      });

      currentData = encrypted.encrypted;
    }

    // Final encrypted package
    const encryptedPackage = {
      signature: SELFX_STORY_SIGNATURE,
      version: '2.0',
      layers: ENCRYPTION_LAYERS,
      layerInfo: layerInfo,
      encryptedData: currentData,
      createdAt: new Date().toISOString()
    };

    return JSON.stringify(encryptedPackage, null, 2);
  } catch (error) {
    throw new Error('Gagal mengenkripsi cerita');
  }
}

// Decrypt story with multiple layers
export async function decryptStoryData(encryptedJson: string): Promise<any> {
  try {
    const encryptedPackage = JSON.parse(encryptedJson);

    // Validate signature
    if (encryptedPackage.signature !== SELFX_STORY_SIGNATURE) {
      throw new Error('File bukan dari selfQ atau signature tidak valid');
    }

    // Validate version
    if (encryptedPackage.version !== '2.0') {
      throw new Error('Versi enkripsi tidak didukung');
    }

    let currentData = encryptedPackage.encryptedData;
    const layerInfo = encryptedPackage.layerInfo;

    // Decrypt layers in reverse order
    for (let layer = ENCRYPTION_LAYERS - 1; layer >= 0; layer--) {
      const info = layerInfo[layer];
      
      // Reconstruct password (this is simplified - in real app, you'd need proper key management)
      const tempData = layer === ENCRYPTION_LAYERS - 1 ? currentData : currentData.slice(0, 20);
      const password = generateLayerPassword(tempData, layer);
      
      // Verify password hint
      const expectedHint = btoa(password).slice(0, 16);
      if (info.passwordHint !== expectedHint) {
        throw new Error(`Layer ${layer + 1} password tidak valid`);
      }

      currentData = await decryptLayer(currentData, info.salt, info.iv, password);
    }

    const decryptedData = JSON.parse(currentData);

    // Validate final signature
    if (decryptedData.signature !== SELFX_STORY_SIGNATURE) {
      throw new Error('Data terenkripsi tidak valid atau rusak');
    }

    // Remove encryption metadata
    const { signature, encryptedAt, layers, ...storyData } = decryptedData;

    return storyData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Gagal mendekripsi cerita');
  }
}

// Validate encrypted story file
export function validateEncryptedStory(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    return data.signature === SELFX_STORY_SIGNATURE && 
           data.version === '2.0' && 
           data.layers === ENCRYPTION_LAYERS &&
           data.encryptedData &&
           Array.isArray(data.layerInfo) &&
           data.layerInfo.length === ENCRYPTION_LAYERS;
  } catch {
    return false;
  }
}