import {
  IEncryptionKey,
  KeyManager,
  EncryptionModule,
  EncryptedStorage,
  EncryptionModuleFactory
} from "../";
import {RandomStringGenerator} from "./RandomStringGenerator";

export class LoadTester {
  private readonly _keyManager: KeyManager;
  private readonly _encModule: EncryptionModule;
  private _storage: EncryptedStorage;
  private readonly _key: IEncryptionKey;


  constructor(
    key: IEncryptionKey,
    password: string,
    storage: Storage
  ) {
    this._keyManager = new KeyManager(storage);
    this._keyManager.setKey(key, password);

    this._key = this._keyManager.getKey(password);
    this._encModule = EncryptionModuleFactory.createModule(this._key);

    this._storage = new EncryptedStorage(this._encModule, storage, false);
  }

  public async loadTest(entryCount: number, valueSize: number): Promise<void> {
    console.log(`Load testing ${this._key.type}...`);

    await this._encModule.init();

    const value = RandomStringGenerator.generate(valueSize);

    const startTime = Date.now();

    for (let i = 0; i < entryCount; i++) {
      const k = `key_${i}`;
      await this._storage.setItem(k, value);
      const read = await this._storage.getItem(k);

      if (read !== value) {
        throw new Error(`values did not match:\n${value}\n${read}`);
      }
    }

    const endTime = Date.now();

    console.log(`Write and read ${entryCount} items with ${this._key.type} in ${endTime - startTime}ms`);
  }
}