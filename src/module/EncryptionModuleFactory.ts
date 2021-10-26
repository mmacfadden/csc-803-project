import {IEncryptionConfig} from "../config";
import {
  WebStorageEncryptionModule,
  ModuleBlowfish,
  ModuleClearText,
  ModuleCryptoJsAes128,
  ModuleCryptoJsAes256,
  ModuleCryptoJsTripleDes,
  ModuleTripleSec,
  ModuleWebCryptoAes256,
  ModuleWebCryptoAes256SaltedKey
} from "./";
import {ModuleTwoFish} from "./ModuleTwoFish";

export class EncryptionModuleFactory {
  public static createModule(config: IEncryptionConfig): WebStorageEncryptionModule {
    switch (config.moduleId) {
      case ModuleCryptoJsAes256.MODULE_ID:
        return new ModuleCryptoJsAes256(config.secret);

      case ModuleCryptoJsAes128.MODULE_ID:
        return new ModuleCryptoJsAes128(config.secret);

      case ModuleCryptoJsTripleDes.MODULE_ID:
        return new ModuleCryptoJsTripleDes(config.secret);

      case ModuleTripleSec.MODULE_ID:
        return new ModuleTripleSec(config.secret);

      case ModuleWebCryptoAes256SaltedKey.MODULE_ID:
        return new ModuleWebCryptoAes256SaltedKey(config.secret);

      case ModuleWebCryptoAes256.MODULE_ID:
        return new ModuleWebCryptoAes256(config.secret);

      case ModuleBlowfish.MODULE_ID:
        return new ModuleBlowfish(config.secret);

      case ModuleTwoFish.MODULE_ID:
        return new ModuleTwoFish(config.secret);

      case ModuleClearText.MODULE_ID:
        return new ModuleClearText();

      default:
        throw new Error("Unknown key type: " + config.moduleId);
    }
  }
}