import {SymmetricEncryptionBasedModule} from "./SymmetricEncryptionBasedModule";
import {WebCryptoUtil} from "./WebCryptoUtil";

export class ModuleWebCryptoAes256SaltedKey extends SymmetricEncryptionBasedModule {
  static readonly MODULE_ID = "AES 256 (WebCrypto API w/ Salted Key)";

  constructor(secret: string) {
    super(ModuleWebCryptoAes256SaltedKey.MODULE_ID, secret);
  }

  public async encrypt(plainText: string): Promise<string> {
    const dataAsBytes = Buffer.from(plainText, "utf-8");
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const aesKey = await WebCryptoUtil.deriveKey(this._encryptionSecret, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt({name: "AES-GCM", iv}, aesKey, dataAsBytes);
    const encryptedBytes = new Uint8Array(encryptedContent);
    const payload = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
    payload.set(salt)
    payload.set(iv, salt.length);
    payload.set(encryptedBytes, salt.length + iv.length);

    return Buffer.from(payload).toString("base64");
  }

  public async decrypt(cypherText: string): Promise<string> {
    const encryptedBytes = Uint8Array.from(Buffer.from(cypherText, "base64"));
    const salt = encryptedBytes.slice(0, 32);
    const iv = encryptedBytes.slice(32, 32 + 12);
    const data = encryptedBytes.slice(32 + 12);

    const aesKey = await WebCryptoUtil.deriveKey(this._encryptionSecret, salt);

    const decryptedContent = await crypto.subtle.decrypt(
      {name: "AES-GCM", iv},
      aesKey,
      data
    );

    const decryptedBytes = new Uint8Array(decryptedContent);
    return Buffer.from(decryptedBytes).toString("utf-8");
  }
}
