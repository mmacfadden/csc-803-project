import {
  EncryptedStorage,
  EncryptionConfigManager,
  EncryptionModule,
  EncryptionModuleFactory,
  IEncryptionConfig,
  ModuleBlowfish,
  ModuleClearText,
  ModuleCryptoJsAes128,
  ModuleCryptoJsAes256,
  ModuleCryptoJsTripleDes,
  ModuleTripleSec,
  ModuleTwoFish,
  ModuleWebCryptoAes256,
  ModuleWebCryptoAes256SaltedKey
} from "../";
import {RandomStringGenerator} from "./RandomStringGenerator";
import {Timing} from "./Timing";
import {ILoadTesterHooks} from "./ILoadTesterHooks";


/**
 * This class implements convenience logic that automates load testing
 * of several encryption modules.
 */
export class LoadTester {

  /**
   * A helper method that tests all known encryption modules.
   *
   * @param masterPassword
   *   The master password to use to encrypt the key.
   * @param storage
   *   The HTML5 Storage object to use to store data.
   * @param quiet
   *   Whether to suppress log output.
   * @param hooks
   *   Callback hooks to get status during testing.
   *
   * @returns A string array of all test results in CSV format.
   */
  public static async testAll(masterPassword: string,
                              storage: Storage,
                              quiet: boolean,
                              hooks?: ILoadTesterHooks): Promise<string[]> {
    const encryption_secret = RandomStringGenerator.generate(200);
    const configs: IEncryptionConfig[] = [
      {type: ModuleClearText.TYPE, secret: encryption_secret},
      {type: ModuleWebCryptoAes256SaltedKey.TYPE, secret: encryption_secret},
      {type: ModuleWebCryptoAes256.TYPE, secret: encryption_secret},
      {type: ModuleCryptoJsAes128.TYPE, secret: encryption_secret},
      {type: ModuleCryptoJsAes256.TYPE, secret: encryption_secret},
      {type: ModuleCryptoJsTripleDes.TYPE, secret: encryption_secret},
      {type: ModuleTripleSec.TYPE, secret: encryption_secret},
      {type: ModuleBlowfish.TYPE, secret: encryption_secret},
      {type: ModuleTwoFish.TYPE, secret: encryption_secret},
    ];

    return LoadTester.runTests(masterPassword, storage, configs, quiet, hooks);
  }

  /**
   * A helper to run a specific set of tests.
   *
   * @param masterPassword
   *   The master password to use to encrypt the key.
   * @param storage
   *   The HTML5 Storage object to use to store data.
   * @param encryptionConfigs
   *   The encryption module configs to test.
   * @param quiet
   *   Whether to suppress log output.
   * @param hooks
   *   Callback hooks to get status during testing.
   *
   * @returns A string array of all test results in CSV format.
   */
  public static async runTests(masterPassword: string,
                               storage: Storage,
                               encryptionConfigs: IEncryptionConfig[],
                               quiet: boolean,
                               hooks?: ILoadTesterHooks): Promise<string[]> {

    if (!quiet) {
      console.log("Storage Encryption Load Testing Started");
    }

    const results = [LoadTester._CSV_HEADER];

    for await (let result of LoadTester._generateTests(masterPassword, storage, encryptionConfigs, quiet, hooks)) {
      results.push(result);
    }

    if (!quiet) {
      console.log("Storage Encryption Load Testing Completed");
    }

    return results;
  }

  /**
   * The header line for the CSV output.
   */
  private static _CSV_HEADER =
    "Encryption Module, Entry Count, Cumulative Time (ms), Average Read/Write Time (ms), Average Write Time (ms), Average Read Time (ms)";

  /**
   * An async generator helper that generates the set of test cases.
   *
   * @param masterPassword
   *   The master password to use to encrypt the key.
   * @param storage
   *   The HTML5 Storage object to use to store data.
   * @param encryptionConfigs
   *   The encryption module configs to test.
   * @param quiet
   *   Whether to suppress log output.
   * @param hooks
   *   Callback hooks to get status during testing.
   *
   * @returns A generator of strings that are the CSV output for each test.
   */
  private static async* _generateTests(masterPassword: string,
                                       storage: Storage,
                                       encryptionConfigs: IEncryptionConfig[],
                                       quiet: boolean,
                                       hooks?: ILoadTesterHooks): AsyncIterableIterator<string> {
    for (const i in encryptionConfigs) {
      const config = encryptionConfigs[i];
      const tester = new LoadTester(config, masterPassword, storage);
      yield tester.loadTest(100, 100, quiet, hooks);
    }
  }

  private readonly _keyManager: EncryptionConfigManager;
  private readonly _encModule: EncryptionModule;
  private readonly _storage: EncryptedStorage;
  private readonly _key: IEncryptionConfig;

  /**
   * Constructs a LoadTester for a single test case.
   *
   * @param config
   *   The encryption module configuration.
   * @param password
   *   The password used to encrypt the configuration.
   * @param storage
   *   The HTML5 Storage instance to us.
   */
  constructor(
    config: IEncryptionConfig,
    password: string,
    storage: Storage
  ) {
    this._keyManager = new EncryptionConfigManager(storage);
    this._keyManager.setConfig(config, password);

    this._key = this._keyManager.getConfig(password);
    this._encModule = EncryptionModuleFactory.createModule(this._key);

    this._storage = new EncryptedStorage(this._encModule, storage, false);
  }

  /**
   * Executes a single load test for the specified configuration.
   *
   * @param entryCount
   *   The number of entries to read and write to Storage.
   * @param valueSize
   *   The number of characters in the value to store.
   * @param quiet
   *   Whether to suppress output.
   * @param hooks
   *   Callback hooks to get status during testing.
   */
  public async loadTest(entryCount: number,
                        valueSize: number,
                        quiet: boolean,
                        hooks?: ILoadTesterHooks): Promise<string> {
    await this._encModule.init();

    if (hooks) {
      hooks.testStarted(this._encModule.type());
    }

    if (!quiet) {
      console.log(`Testing ${this._encModule.type()}`);
    }

    let cumulativeWriteTime = 0;
    let cumulativeReadTime = 0;

    for (let i = 0; i < entryCount; i++) {
      const k = `key_${i}`;
      const value = RandomStringGenerator.generate(valueSize);

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

    if (hooks) {
      hooks.testFinished(this._encModule.type());
    }

    return `${this._encModule.type()},${entryCount},${cumulativeTime},${averageTime},${averageWriteTime},${averageReadTime}`;
  }
}