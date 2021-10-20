import * as CryptoJS from "crypto-js";
import {KeyBasedModule} from "./KeyBasedModule";

export class ModuleCryptoJsTripleDes extends KeyBasedModule {
  static readonly TYPE = "Triple DES (Crypto JS)";

  constructor(secret: string) {
    super(ModuleCryptoJsTripleDes.TYPE, secret);
  }

  public async encrypt(plainText: string): Promise<string> {
    return CryptoJS.TripleDES.encrypt(plainText, this._encryptionSecret).toString();
  }

  public async decrypt(cypherText: string): Promise<string> {
    const bytes = CryptoJS.TripleDES.decrypt(cypherText, this._encryptionSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
