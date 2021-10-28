import {expect} from 'chai';
import {
  EncryptionModuleFactory, ModuleBlowfish, ModuleClearText,
  ModuleCryptoJsAes128,
  ModuleCryptoJsAes256,
  ModuleCryptoJsTripleDes,
  ModuleTripleSec, ModuleTwoFish, ModuleWebCryptoAes256, ModuleWebCryptoAes256SaltedKey
} from '../../src/';

describe('EncryptionModuleFactory', () => {

  describe('createModule', () => {
    it('throws on unknown type', () => {
      expect(() =>
        EncryptionModuleFactory.createModule({moduleId: "unknown", secret: "none"})).to.throw;
    });

    it(ModuleCryptoJsAes256.MODULE_ID, () => {
      const config = {
        moduleId: ModuleCryptoJsAes256.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleCryptoJsAes256).to.be.true;
    });

    it(ModuleCryptoJsAes128.MODULE_ID, () => {
      const config = {
        moduleId: ModuleCryptoJsAes128.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleCryptoJsAes128).to.be.true;
    });

    it(ModuleCryptoJsTripleDes.MODULE_ID, () => {
      const config = {
        moduleId: ModuleCryptoJsTripleDes.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleCryptoJsTripleDes).to.be.true;
    });

    it(ModuleTripleSec.MODULE_ID, () => {
      const config = {
        moduleId: ModuleTripleSec.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleTripleSec).to.be.true;
    });

    it(ModuleWebCryptoAes256SaltedKey.MODULE_ID, () => {
      const config = {
        moduleId: ModuleWebCryptoAes256SaltedKey.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleWebCryptoAes256SaltedKey).to.be.true;
    });

    it(ModuleWebCryptoAes256.MODULE_ID, () => {
      const config = {
        moduleId: ModuleWebCryptoAes256.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleWebCryptoAes256).to.be.true;
    });

    it(ModuleBlowfish.MODULE_ID, () => {
      const config = {
        moduleId: ModuleBlowfish.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleBlowfish).to.be.true;
    });

    it(ModuleTwoFish.MODULE_ID, () => {
      const config = {
        moduleId: ModuleTwoFish.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleTwoFish).to.be.true;
    });

    it(ModuleClearText.MODULE_ID, () => {
      const config = {
        moduleId: ModuleClearText.MODULE_ID,
        secret: "none"
      }
      const module = EncryptionModuleFactory.createModule(config);
      expect(module instanceof ModuleClearText).to.be.true;
    });
  });
});