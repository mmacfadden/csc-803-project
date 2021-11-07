import {expect} from 'chai';
import {
  EncryptionModuleFactory,
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
  ModuleWebCryptoAes256SaltedKey
} from '../../src/';
import {Crypto} from "node-webcrypto-ossl";

const MODULES = [
  new ModuleCryptoJsAes256("secret"),
  new ModuleCryptoJsAes128("secret"),
  new ModuleCryptoJsTripleDes("secret"),
  new ModuleTripleSec("secret"),
  new ModuleWebCryptoAes256SaltedKey("secret"),
  new ModuleWebCryptoAes128("secret"),
  new ModuleWebCryptoAes256("secret"),
  new ModuleNodeWebCryptoAes128("secret"),
  new ModuleNodeWebCryptoAes256("secret"),
  new ModuleBlowfish("secret"),
  new ModuleTwoFish("secret"),
  new ModuleClearText()
];

const plainText = "some plain text";

describe('Encryption Module Correctness', () => {
  MODULES.forEach(module => {
    it(`${module.moduleId()} Encrypt / Decrypt`, async () => {
      await module.init();
      const cypherText = await module.encrypt(plainText);
      const decrypted = await module.decrypt(cypherText);
      expect(decrypted).to.eq(plainText);
    }).timeout(10000);
  });
});