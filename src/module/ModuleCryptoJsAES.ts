import CryptoJS from "crypto-js";
import { KeyBasedModule } from "./KeyBasedModule";

export class ModuleCryptoJsAES extends KeyBasedModule {
    static readonly TYPE = "CryptoJsAES";
    
    constructor(key: string) {
        super(key);
    }

    encrypt(clearText: string): string {
        return CryptoJS.AES.encrypt(clearText, this._key).toString();;
    }
    
    decrypt(encrypted: string): string {
        var bytes  = CryptoJS.AES.decrypt(encrypted, this._key);
        var decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    }
}
