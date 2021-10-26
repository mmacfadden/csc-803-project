import {EncryptionModule} from "../module/";
import * as lz from "lz-string";

/**
 * Implements an encrypted facade for the HTML5 Storage API. The API
 * is almost binary compatible to the HTML5 Storage API itself. All
 * data will be encrypted before sent to the underlying Storage.
 */
export class EncryptedStorage {
  private readonly _encryptionModule: EncryptionModule;
  private readonly _storage: Storage;
  private readonly _compress: boolean;

  constructor(encryptionModule: EncryptionModule,
              storage: Storage,
              compress: boolean = false) {
    this._encryptionModule = encryptionModule;
    this._storage = storage;
    this._compress = compress;
  }

  public get length(): number {
    return this._storage.length;
  }

  public clear(): void {
    this._storage.clear();
  }

  public async setItem(key: string, value: string): Promise<void> {
    if (this._compress) {
      // value = LZUTF8.compress(value, {outputEncoding: "StorageBinaryString"});
      value = lz.compressToUTF16(value);
    }

    let encrypted = await this._encryptionModule.encrypt(value);

    this._storage.setItem(key, encrypted);
  }

  public async getItem(key: string): Promise<string | null> {
    const raw = this._storage.getItem(key);
    if (raw) {
      let value = await this._encryptionModule.decrypt(raw);
      if (this._compress) {
        // value = LZUTF8.decompress(value, {inputEncoding: "StorageBinaryString", outputEncoding: "String"});
        value = lz.decompressFromUTF16(value) as string;
      }
      return value;
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