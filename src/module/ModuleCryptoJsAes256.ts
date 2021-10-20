import CryptoJS from "crypto-js";
import {KeyBasedModule} from "./KeyBasedModule";

export class ModuleCryptoJsAes256 extends KeyBasedModule {
  static readonly TYPE = "AES 256 (Crypto JS)";

  constructor(secret: string) {
    super(ModuleCryptoJsAes256.TYPE, secret);
  }

  public async encrypt(plainText: string): Promise<string> {
    return CryptoJS.AES.encrypt(plainText, this._encryptionSecret).toString();
  }

  public async decrypt(cypherText: string): Promise<string> {
    const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(cypherText, this._encryptionSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
