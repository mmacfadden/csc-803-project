import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
const {expect} = chai;
chai.use(chaiAsPromised);

import {LoadTester, InMemoryStorage, IEncryptionConfig, ModuleClearText, ILoadTestResult} from '../../src/';
import {ILoadTesterHooks} from "../../src/core/ILoadTesterHooks";
import {Crypto} from "node-webcrypto-ossl";

if (globalThis.crypto === undefined) {
  globalThis.crypto = new Crypto({
    directory: ".key_storage"
  });
}

describe('LoadTester', () => {
  const PASSWORD = "password";
  const CONFIG: IEncryptionConfig = {
    moduleId: ModuleClearText.MODULE_ID,
    secret: "secret"
  };

  const ENTRY_COUNT = 10;
  const VALUE_SIZE = 10;
  const QUIET = false;

  describe('constructor', () => {
    it('throws if config is not set', () => {
      const storage = new InMemoryStorage();
      expect( () => new LoadTester(undefined as any, PASSWORD, storage)).to.throw();
    });

    it('throws if password is not set', () => {
      const storage = new InMemoryStorage();
      expect( () => new LoadTester(CONFIG, undefined as any, storage)).to.throw();
    });

    it('throws if storage is not set', () => {
      expect( () => new LoadTester(CONFIG, PASSWORD, undefined as any)).to.throw();
    });

    it('Succeeds if valid args are passed in', () => {
      const storage = new InMemoryStorage();
      new LoadTester(CONFIG, PASSWORD, storage);
    });
  });

  describe('loadTest', () => {
    it('throws if entityCount is less than 1',  () => {
      const storage = new InMemoryStorage();
      const loadTester = new LoadTester(CONFIG, PASSWORD, storage);
      expect( loadTester.loadTest(0, VALUE_SIZE, QUIET)).to.eventually.be.rejected;
    });

    it('throws if valueSize is less than 1', () => {
      const storage = new InMemoryStorage();
      const loadTester = new LoadTester(CONFIG, PASSWORD, storage);
      expect( loadTester.loadTest(ENTRY_COUNT, 0, QUIET)).to.eventually.be.rejected;
    });

    it('succeed if properly configured', async () => {
      const storage = new InMemoryStorage();
      const loadTester = new LoadTester(CONFIG, PASSWORD, storage);
      const result = await loadTester.loadTest(ENTRY_COUNT, VALUE_SIZE, QUIET);
      expect(result.moduleId).to.eq(CONFIG.moduleId);
    });
  });

  describe('runTests', () => {
    it('returns the correct number of results', async () => {
      const storage = new InMemoryStorage();
      const CONFIGS = [CONFIG, CONFIG];
      const results = await LoadTester.runTests(
        PASSWORD, ENTRY_COUNT, VALUE_SIZE, storage, CONFIGS, true);
      expect(results.length).to.eq(CONFIGS.length);
    });

    it('works in non-quiet mode', async () => {
      const storage = new InMemoryStorage();
      const CONFIGS = [CONFIG, CONFIG];
      await LoadTester.runTests(
        PASSWORD, ENTRY_COUNT, VALUE_SIZE, storage, CONFIGS, false);

    });

    it('hooks are properly called', async () => {
      const storage = new InMemoryStorage();
      const CONFIGS = [CONFIG];
      const hooks: ILoadTesterHooks = {
        testFinished(result: ILoadTestResult): void {
          expect(result.moduleId).to.eq(CONFIG.moduleId);
        }, testStarted(module: string): void {
          expect(module).to.eq(CONFIG.moduleId);
        }, testingStarted(configs: IEncryptionConfig[]): void {
          expect(configs).to.deep.eq(CONFIGS);
        }
      }
      const results = await LoadTester.runTests(
        PASSWORD, ENTRY_COUNT, VALUE_SIZE, storage, CONFIGS, true, hooks);
      expect(results.length).to.eq(CONFIGS.length);
    });
  });

  describe('testAll', () => {
    it('returns the correct number of results', async () => {
      const storage = new InMemoryStorage();
      const results = await LoadTester.testAll(
        PASSWORD, 1, 10, storage, false);
      expect(results.length).to.eq(9);
    }).timeout(5000);
  });
});