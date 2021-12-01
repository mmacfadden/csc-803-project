import {EncryptionModuleFactory, EncryptionModule} from "../module/";
import {IEncryptionConfig} from "../config";

/**
 * Implements an encrypted facade for the HTML5 Storage API. The API
 * is almost binary compatible to the HTML5 Storage API itself. All
 * data will be encrypted before sent to the underlying Storage.
 */
export class EncryptedStorage {

  /**
   * A helper method to create an EncryptedStorage instance from a configuration file
   * and the underlying storage.
   *
   * @param config
   *   The configuration to use.
   * @param storage
   *   The underlying storage (e.g. session or local storage)
   *
   * @returns An EncryptedStorage instance.
   */
  public static create(config: IEncryptionConfig, storage: Storage): EncryptedStorage {
    const module = EncryptionModuleFactory.createModule(config);
    return new EncryptedStorage(module, storage);
  }

  private readonly _encryptionModule: EncryptionModule;
  private readonly _storage: Storage;

  /**
   * Constructs a new EncryptedStorage using the specified EncryptionModule
   * and underlying Storage.
   *
   * @param encryptionModule
   *   The encryption module to use to encrypt / decrypt data.
   * @param storage
   *   The underlying storage to use to persist data.
   */
  constructor(encryptionModule: EncryptionModule, storage: Storage) {
    this._encryptionModule = encryptionModule;
    this._storage = storage;
  }

  /**
   * @returns The unique id of the encryption module being used to encrypt data.
   */
  public moduleId(): string {
    return this._encryptionModule.moduleId();
  }

  /**
   * Asynchronously initializes the EncryptedStorage object. This method must
   * be called before reading or writing data.
   */
  public async init(): Promise<void> {
    return this._encryptionModule.init();
  }

  /**
   * @returns The number of key/value pairs stored in Storage.
   */
  public get length(): number {
    return this._storage.length;
  }

  /**
   * Returns the nth key.
   * @param index
   *   The index of the key to get.
   * @returns The nth key, or null if not such key exists.
   */
  public key(index: number): string | null {
    return this._storage.key(index);
  }

  /**
   * Sets a key / value pair.
   * @param key
   *   The key to set.
   * @param value
   *   The value to set for the key.
   */
  public async setItem(key: string, value: string): Promise<void> {
    let encrypted = await this._encryptionModule.encrypt(value);
    this._storage.setItem(key, encrypted);
  }

  /**
   * Gets the value stored for a key.
   *
   * @param key
   *   The key to get the value of.
   *
   * @returns The value stored at the key, or null if the value is not set.
   */
  public async getItem(key: string): Promise<string | null> {
    const raw = this._storage.getItem(key);
    if (raw) {
      return await this._encryptionModule.decrypt(raw);
    } else {
      return null;
    }
  }

  /**
   * Removes a key/value pair.
   *
   * @param key
   *   The key to remove.
   */
  public removeItem(key: string): void {
    this._storage.removeItem(key);
  }

  /**
   * Removes all key/value pairs.
   */
  public clear(): void {
    this._storage.clear();
  }
}