import {EncryptedStorage, EncryptionModule, EncryptionModuleFactory, IEncryptionKey, KeyManager} from "../";
import {RandomStringGenerator} from "./RandomStringGenerator";
import {Timing} from "./Timing";

export class LoadTester {
  public static printCsvHeader(): void {
    console.log(`Encryption Module, Entry Count, Cumulative Time (ms), Average Read/Write Time (ms), Average Write Time (ms), Average Read Time (ms)`);
  }

  private readonly _keyManager: KeyManager;
  private readonly _encModule: EncryptionModule;
  private readonly _storage: EncryptedStorage;
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
    await this._encModule.init();

    const value = RandomStringGenerator.generate(valueSize);

    let cumulativeWriteTime = 0;
    let cumulativeReadTime = 0;

    for (let i = 0; i < entryCount; i++) {
      const k = `key_${i}`;

      const writeStartTime = Timing.now();
      await this._storage.setItem(k, value);

      const readStartTime = Timing.now();
      const read = await this._storage.getItem(k);

      cumulativeReadTime += Timing.now() - readStartTime;
      cumulativeWriteTime += readStartTime - writeStartTime;

      if (read !== value) {
        throw new Error(`values did not match:\n"${value}"\n"${read}"`);
      }
    }

    const cumulativeTime = cumulativeWriteTime + cumulativeReadTime;
    const averageTime = cumulativeTime / entryCount;
    const averageWriteTime = cumulativeWriteTime / entryCount;
    const averageReadTime = cumulativeReadTime / entryCount;

    console.log(`${this._encModule.type()},${entryCount},${cumulativeTime},${averageTime},${averageWriteTime},${averageReadTime}`);
  }
}