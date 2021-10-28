import {WebStorageEncryptionModule} from "../module/";

/**
 * Implements an encrypted facade for the HTML5 Storage API. The API
 * is almost binary compatible to the HTML5 Storage API itself. All
 * data will be encrypted before sent to the underlying Storage.
 */
export class EncryptedStorage {
  private readonly _encryptionModule: WebStorageEncryptionModule;
  private readonly _storage: Storage;

  constructor(encryptionModule: WebStorageEncryptionModule,
              storage: Storage) {
    this._encryptionModule = encryptionModule;
    this._storage = storage;
  }

  public get length(): number {
    return this._storage.length;
  }

  public clear(): void {
    this._storage.clear();
  }

  public async setItem(key: string, value: string): Promise<void> {
    let encrypted = await this._encryptionModule.encrypt(value);
    this._storage.setItem(key, encrypted);
  }

  public async getItem(key: string): Promise<string | null> {
    const raw = this._storage.getItem(key);
    if (raw) {
      return await this._encryptionModule.decrypt(raw);
    } else {
      return null;
    }
  }

  public key(index: number): string | null {
    return this._storage.key(index);
  }

  public removeItem(key: string): void {
    this._storage.removeItem(key);
  }
}