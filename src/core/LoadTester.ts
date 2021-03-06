import {EncryptedStorage, IEncryptionConfig, ILoadTestConfig} from "../";
import {RandomStringGenerator} from "./RandomStringGenerator";
import {Timing} from "./Timing";
import {ILoadTesterHooks} from "./ILoadTesterHooks";
import {ILoadTestResult} from "./ILoadTestResult";


/**
 * This class implements convenience logic that automates load testing
 * of several encryption modules.
 */
export class LoadTester {

  /**
   * The storage key that is used to read and write data during load testing.
   * @private
   */
  private static readonly _KEY = "load_test_key";

  /**
   * A helper method that tests all known encryption modules.
   *
   * @param encryptionConfigs
   *   The encryption configurations to test.
   * @param operationCount
   *   The number of entries to read and write to Storage.
   * @param valueSizeBytes
   *   The number of characters in the value to store.
   * @param storage
   *   The HTML5 Storage object to use to store data.
   * @param quiet
   *   Whether to suppress log output.
   * @param hooks
   *   Callback hooks to get status during testing.
   *
   * @returns A string array of all test results in CSV format.
   */
  public static async testEncryptionConfigs(encryptionConfigs: IEncryptionConfig[],
                                            operationCount: number,
                                            valueSizeBytes: number,
                                            storage: Storage,
                                            quiet: boolean,
                                            hooks?: ILoadTesterHooks): Promise<ILoadTestResult[]> {
    const testConfigs: ILoadTestConfig[] = encryptionConfigs.map(ec => {
      return {encryptionConfig: ec, valueSizeBytes, operationCount: operationCount};
    });

    return LoadTester.runTests(testConfigs, storage, quiet, hooks);
  }

  /**
   * A helper to run a specific set of tests.
   *
   * @param testConfigs
   *   The encryption module configs to test.
   * @param storage
   *   The HTML5 Storage object to use to store data.
   * @param quiet
   *   Whether to suppress log output.
   * @param hooks
   *   Callback hooks to get status during testing.
   *
   * @returns A string array of all test results in CSV format.
   */
  public static async runTests(testConfigs: ILoadTestConfig[],
                               storage: Storage,
                               quiet: boolean,
                               hooks?: ILoadTesterHooks): Promise<ILoadTestResult[]> {
    if (hooks) {
      hooks.testingStarted(testConfigs);
    }

    if (!quiet) {
      console.log("Storage Encryption Load Testing Started");
    }

    const results: ILoadTestResult[] = [];

    for await (let result of LoadTester._generateTests(testConfigs, storage, quiet, hooks)) {
      results.push(result);
    }

    if (!quiet) {
      console.log("Storage Encryption Load Testing Completed");
    }

    return results;
  }

  /**
   * An async generator helper that generates the set of test cases.
   * @param testConfigs
   *   The encryption module configs to test.
   * @param storage
   *   The HTML5 Storage object to use to store data.
   * @param quiet
   *   Whether to suppress log output.
   * @param hooks
   *   Callback hooks to get status during testing.
   *
   * @returns A generator of strings that are the CSV output for each test.
   */
  private static async* _generateTests(testConfigs: ILoadTestConfig[],
                                       storage: Storage,
                                       quiet: boolean,
                                       hooks?: ILoadTesterHooks): AsyncIterableIterator<ILoadTestResult> {
    for (const i in testConfigs) {
      const config = testConfigs[i];
      const tester = new LoadTester(config, storage);
      yield tester.loadTest(quiet, hooks);
    }
  }

  private readonly _storage: EncryptedStorage;
  private readonly _config: ILoadTestConfig;

  /**
   * Constructs a LoadTester for a single test case.
   *
   * @param config
   *   The encryption module configuration.
   * @param storage
   *   The HTML5 Storage instance to us.
   */
  constructor(config: ILoadTestConfig, storage: Storage) {
    if (!config) {
      throw new Error("config must be defined");
    }

    if (!config.operationCount || config.operationCount <= 0) {
      throw new Error("operationCount must be > 0");
    }

    if (!config.valueSizeBytes || config.valueSizeBytes <= 0) {
      throw new Error("valueSize must be > 0");
    }

    this._config = config;

    if (!storage) {
      throw new Error("storage must be defined");
    }

    this._storage = EncryptedStorage.create(config.encryptionConfig, storage);
  }

  /**
   * Executes a single load test for the specified configuration.
   *
   * @param quiet
   *   Whether to suppress output.
   * @param hooks
   *   Callback hooks to get status during testing.
   */
  public async loadTest(quiet: boolean, hooks?: ILoadTesterHooks): Promise<ILoadTestResult> {

    this._storage.clear();

    if (hooks) {
      hooks.testStarted(this._storage.moduleId());
    }

    if (!quiet) {
      console.log(`Testing ${this._storage.moduleId()}`);
    }

    await this._storage.init();

    Timing.startMeasurementSession();

    for (let i = 0; i < this._config.operationCount; i++) {
      const value = RandomStringGenerator.generate(this._config.valueSizeBytes);

      Timing.writeStart(i);
      await this._storage.setItem(LoadTester._KEY, value);
      Timing.writeEnd(i);

      Timing.readStart(i);
      await this._storage.getItem(LoadTester._KEY);
      Timing.readEnd(i);
    }

    const cumulativeReadTime = Timing.getTotalReadTime();
    const cumulativeWriteTime = Timing.getTotalWriteTime();

    const totalTimeMs = cumulativeWriteTime + cumulativeReadTime;
    const averageReadWriteTimeMs = totalTimeMs / this._config.operationCount;
    const averageWriteTimeMs = cumulativeWriteTime / this._config.operationCount;
    const averageReadTimeMs = cumulativeReadTime / this._config.operationCount;

    const totalBytes = this._config.operationCount * this._config.valueSizeBytes;
    const avgReadThroughputKbps = (totalBytes / 1000) / (cumulativeReadTime / 1000);
    const avgWriteThroughputKbps = (totalBytes / 1000) / (cumulativeWriteTime / 1000);

    const result: ILoadTestResult = {
      moduleId: this._storage.moduleId(),
      operationCount: this._config.operationCount,
      totalTimeMs,
      averageWriteTimeMs,
      averageReadTimeMs,
      averageReadWriteTimeMs,
      avgReadThroughputKbps,
      avgWriteThroughputKbps
    };

    if (hooks) {
      hooks.testFinished(result);
    }

    return result;
  }
}