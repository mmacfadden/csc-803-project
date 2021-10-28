import {expect} from 'chai';
import {EncryptedStorage, InMemoryStorage, ModuleClearText} from '../../src/';

describe('EncryptedStorage', () => {
  const KEY = "k";
  const VALUE = "value";
  const module = new ModuleClearText();

  describe('constructor', () => {
    it('Newly constructed storage should be empty', () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      expect(storage.length).to.eq(0);
    });
  });

  describe('setItem', () => {
    it('Correctly sets an key / value pair', async () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      await storage.setItem(KEY, VALUE);
      const value = await storage.getItem(KEY);
      expect(value).to.eq(VALUE);
    });
  });

  describe('getItem', () => {
    it('Correctly gets an key / value pair', async () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      await storage.setItem(KEY, VALUE);
      const value = await storage.getItem(KEY);
      expect(value).to.eq(VALUE);
    });

    it('Returns null for a key that is not set.', async () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      const value = await storage.getItem(KEY);
      expect(value).to.be.null;
    });
  });

  describe('removeItem', () => {
    it('Correctly removes an key', async () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      await storage.setItem(KEY, VALUE);
      const setValue = await storage.getItem(KEY);
      expect(setValue).to.eq(VALUE);

      storage.removeItem(KEY);
      const noValue = await storage.getItem(KEY);
      expect(noValue).to.be.null;
    });

    it('Ignores removing an key it does not have', () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      storage.removeItem(KEY);
    });
  });

  describe('clear', () => {
    it('Removes all', async () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      await storage.setItem(KEY, VALUE);
      await storage.setItem("k2", "v2");
      expect(storage.length).to.eq(2);

      storage.clear();
      expect(storage.length).to.eq(0);
    });
  });

  describe('length', () => {
    it('Newly constructed storage has zero length', () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      expect(storage.length).to.eq(0);
    });

    it('Returns the correct length.', async () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      await storage.setItem(KEY, VALUE);
      expect(storage.length).to.eq(1);
    });
  });

  describe('key', () => {
    it('Newly constructed storage has zero length', () => {
      const memStore = new InMemoryStorage();
      const storage = new EncryptedStorage(module, memStore);
      storage.setItem("key1", "v1");
      storage.setItem("key2", "v2");
      expect(storage.key(0)).to.eq(memStore.key(0));
    });

  });
});