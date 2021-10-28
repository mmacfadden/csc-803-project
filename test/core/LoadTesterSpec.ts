import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
const {expect} = chai;
chai.use(chaiAsPromised);

import {LoadTester, InMemoryStorage, IEncryptionConfig, ModuleClearText} from '../../src/';

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
      const storage = new InMemoryStorage();
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
      const results = await LoadTester.runTests(PASSWORD, ENTRY_COUNT, VALUE_SIZE, storage, CONFIGS, true);
      expect(results.length).to.eq(CONFIGS.length);
    });
  });
});