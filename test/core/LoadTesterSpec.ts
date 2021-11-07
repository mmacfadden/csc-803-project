import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {
  IEncryptionConfig,
  ILoadTestConfig,
  ILoadTesterHooks,
  ILoadTestResult,
  InMemoryStorage,
  LoadTester,
  ModuleBlowfish,
  ModuleClearText,
  ModuleCryptoJsAes128,
  ModuleCryptoJsAes256,
  ModuleCryptoJsTripleDes,
  ModuleNodeWebCryptoAes128,
  ModuleNodeWebCryptoAes256,
  ModuleTripleSec,
  ModuleTwoFish,
  ModuleWebCryptoAes128,
  ModuleWebCryptoAes256,
  RandomStringGenerator
} from '../../src/';
import {Crypto} from "node-webcrypto-ossl";

const {expect} = chai;
chai.use(chaiAsPromised);

if (globalThis.crypto === undefined) {
  globalThis.crypto = new Crypto({
    directory: ".key_storage"
  });
}

describe('LoadTester', () => {
  const ENTRY_COUNT = 10;
  const VALUE_SIZE = 10;

  const ENC_CONFIG: IEncryptionConfig = {
    moduleId: ModuleClearText.MODULE_ID,
    secret: "secret"
  };

  const CONFIG: ILoadTestConfig = {
    encryptionConfig: ENC_CONFIG,
    entryCount: ENTRY_COUNT,
    valueSizeBytes: VALUE_SIZE
  }


  const QUIET = false;

  describe('constructor', () => {
    it('throws if config is not set', () => {
      const storage = new InMemoryStorage();
      expect( () => new LoadTester(undefined as any, storage)).to.throw();
    });

    it('throws if storage is not set', () => {
      expect( () => new LoadTester(CONFIG, undefined as any)).to.throw();
    });

    it('Succeeds if valid args are passed in', () => {
      const storage = new InMemoryStorage();
      new LoadTester(CONFIG, storage);
    });
  });

  describe('loadTest', () => {
    it('throws if entityCount is less than 1',  () => {
      const storage = new InMemoryStorage();
      const loadTester = new LoadTester(CONFIG, storage);
      expect( loadTester.loadTest(QUIET)).to.eventually.be.rejected;
    });

    it('throws if valueSize is less than 1', () => {
      const storage = new InMemoryStorage();
      const loadTester = new LoadTester(CONFIG, storage);
      expect( loadTester.loadTest(QUIET)).to.eventually.be.rejected;
    });

    it('succeed if properly configured', async () => {
      const storage = new InMemoryStorage();
      const loadTester = new LoadTester(CONFIG, storage);
      const result = await loadTester.loadTest(QUIET);
      expect(result.moduleId).to.eq(CONFIG.encryptionConfig.moduleId);
    });
  });

  describe('runTests', () => {
    it('returns the correct number of results', async () => {
      const storage = new InMemoryStorage();
      const CONFIGS = [CONFIG, CONFIG];
      const results = await LoadTester.runTests(CONFIGS, storage, true);
      expect(results.length).to.eq(CONFIGS.length);
    });

    it('works in non-quiet mode', async () => {
      const storage = new InMemoryStorage();
      const CONFIGS = [CONFIG, CONFIG];
      await LoadTester.runTests(CONFIGS, storage, false);
    });

    it('hooks are properly called', async () => {
      const storage = new InMemoryStorage();
      const CONFIGS = [CONFIG];
      const hooks: ILoadTesterHooks = {
        testFinished(result: ILoadTestResult): void {
          expect(result.moduleId).to.eq(CONFIG.encryptionConfig.moduleId);
        }, testStarted(module: string): void {
          expect(module).to.eq(CONFIG.encryptionConfig.moduleId);
        }, testingStarted(configs: ILoadTestConfig[]): void {
          expect(configs).to.deep.eq(CONFIGS);
        }
      }
      const results = await LoadTester.runTests(CONFIGS, storage, true, hooks);
      expect(results.length).to.eq(CONFIGS.length);
    });
  });

  describe('testAll', () => {
    it('returns the correct number of results', async () => {
      const storage = new InMemoryStorage();

      const encryption_secret = RandomStringGenerator.generate(200);
      const encryptionConfigs = [
        {moduleId: ModuleClearText.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleNodeWebCryptoAes128.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleNodeWebCryptoAes256.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleWebCryptoAes128.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleWebCryptoAes256.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleCryptoJsAes128.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleCryptoJsAes256.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleCryptoJsTripleDes.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleTripleSec.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleBlowfish.MODULE_ID, secret: encryption_secret},
        {moduleId: ModuleTwoFish.MODULE_ID, secret: encryption_secret},
      ];

      const results = await LoadTester.testEncryptionConfigs(
        encryptionConfigs,1, 10, storage, false);
      expect(results.length).to.eq(11);
    }).timeout(20000);
  });
});