import * as CryptoJS from 'crypto-js';
import {IEncryptionKey} from "./IEncryptionKey";

export class KeyManager {
  private static KEY_PROPERTY = "__master_key__";

  private readonly _storage: Storage;

  constructor(storage: Storage) {
    this._storage = storage;
  }

  public setPassword(oldPassword: string, newPassword: string): void {
    const key = this.getKey(oldPassword);
    this.setKey(key, newPassword);
  }

  public getKey(password: string): IEncryptionKey {
    const encryptedKeyData = this._storage.getItem(KeyManager.KEY_PROPERTY);

    if (!encryptedKeyData) {
      throw new Error("Encryption key is not set.");
    }

    const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(encryptedKeyData, password);
    const serializedKey = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(serializedKey);
  }

  public setKey(key: IEncryptionKey, password: string): void {
    const keyData = JSON.stringify(key, null, "");
    const encryptedKeyData = CryptoJS.AES.encrypt(keyData, password).toString();
    this._storage.setItem(KeyManager.KEY_PROPERTY, encryptedKeyData);
  }
}