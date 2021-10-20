import {KeyBasedModule} from "./KeyBasedModule";
import {WebCryptoUtil} from "./WebCryptoUtil";

export class ModuleWebCryptoAes256 extends KeyBasedModule {
  static readonly TYPE = "AES 256 (WebCrypto API)";
  private _derivedKey: CryptoKey | null;

  constructor(secret: string) {
    super(ModuleWebCryptoAes256.TYPE, secret);
    this._derivedKey = null;
  }

  public async init(): Promise<void> {
    const salt = crypto.getRandomValues(new Uint8Array(32));
    this._derivedKey = await WebCryptoUtil.deriveKey(this._encryptionSecret, salt);
  }

  public async encrypt(plainText: string): Promise<string> {
    const dataAsBytes = Buffer.from(plainText, "utf-8");
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const saltedData = new Uint8Array([...salt, ...dataAsBytes]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt({name: "AES-GCM", iv}, this._derivedKey!, saltedData);
    const encryptedBytes = new Uint8Array(encryptedContent);
    const payload = new Uint8Array([...iv, ...encryptedBytes]);
    return Buffer.from(payload).toString("base64");
  }

  public async decrypt(cypherText: string): Promise<string> {
    const encryptedBytes = Uint8Array.from(Buffer.from(cypherText, "base64"));
    const iv = encryptedBytes.slice(0, 12);
    const data = encryptedBytes.slice(12);

    const decryptedContent = await crypto.subtle.decrypt(
      {name: "AES-GCM", iv},
      this._derivedKey!,
      data
    );

    const saltedData = new Uint8Array(decryptedContent);
    const decryptedData = saltedData.slice(32);
    return Buffer.from(decryptedData).toString("utf-8");
  }
}
