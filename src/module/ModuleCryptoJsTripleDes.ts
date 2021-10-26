import * as CryptoJS from "crypto-js";
import {SymmetricEncryptionBasedModule} from "./SymmetricEncryptionBasedModule";

export class ModuleCryptoJsTripleDes extends SymmetricEncryptionBasedModule {
  static readonly MODULE_ID = "Triple DES (Crypto JS)";

  constructor(secret: string) {
    super(ModuleCryptoJsTripleDes.MODULE_ID, secret);
  }

  public async encrypt(plainText: string): Promise<string> {
    return CryptoJS.TripleDES.encrypt(plainText, this._encryptionSecret).toString();
  }

  public async decrypt(cypherText: string): Promise<string> {
    const bytes = CryptoJS.TripleDES.decrypt(cypherText, this._encryptionSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
