import * as pbkdf2 from "pbkdf2"; 
import CryptoJS from 'crypto-js';
import { IEcryptionKey } from "./IEncryptionKey";

export class KeyManager {
    private static KEY_PROPERTY = "__master_key__";

    public setPassword(oldPassword: string, newPasword: string): void {
        const key = this.getKey(oldPassword);
        this.setKey(key, newPasword);
    }

    public getKey(password: string): IEcryptionKey {
        const encryptedKeyData = localStorage.getItem(KeyManager.KEY_PROPERTY);
        if (!encryptedKeyData) {
            throw new Error("Encryption key is not set.");
        }

        const derivedKey = KeyManager._derivedKey(password);

        const bytes = CryptoJS.AES.decrypt(encryptedKeyData, derivedKey);
        const serializedKey = bytes.toString(CryptoJS.enc.Utf8);
        
        const parsed = JSON.parse(serializedKey);
        const key = {...parsed, created: new Date(parsed.created)};
        return key;
    }

    public setKey(key: IEcryptionKey, password: string): void {
        const converted = {...key, created: key.created.toString()}
        const keyData = JSON.stringify(converted, null, "");
        const derivedKey = KeyManager._derivedKey(password);
        const encryptedKeyData = CryptoJS.AES.encrypt(keyData, derivedKey).toString();
        localStorage.setItem(KeyManager.KEY_PROPERTY, encryptedKeyData);
    }

    private static _derivedKey(password: string): string {
        const derivedKey = pbkdf2.pbkdf2Sync(password, 'salt', 1, 512, 'sha512');
        const hexKey = derivedKey.toString("hex");
        return hexKey;
    }
}