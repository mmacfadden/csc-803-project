export class WebCryptoUtil {
  public static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const passwordAsBytes = Buffer.from(password, "utf-8");
    const passwordKey: CryptoKey = await crypto.subtle.importKey(
      "raw",
      passwordAsBytes,
      "PBKDF2",
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 250000,
        hash: {name: "SHA-256"}
      },
      passwordKey,
      {name: "AES-GCM", length: 256},
      false,
      ['encrypt', 'decrypt']
    );
  }
}