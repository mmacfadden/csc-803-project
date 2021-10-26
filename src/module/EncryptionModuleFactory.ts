import {IEncryptionConfig} from "../config";
import {
  EncryptionModule,
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
  public static createModule(key: IEncryptionConfig): EncryptionModule {
    switch (key.type) {
      case ModuleCryptoJsAes256.TYPE:
        return new ModuleCryptoJsAes256(key.secret);

      case ModuleCryptoJsAes128.TYPE:
        return new ModuleCryptoJsAes128(key.secret);

      case ModuleCryptoJsTripleDes.TYPE:
        return new ModuleCryptoJsTripleDes(key.secret);

      case ModuleTripleSec.TYPE:
        return new ModuleTripleSec(key.secret);

      case ModuleWebCryptoAes256SaltedKey.TYPE:
        return new ModuleWebCryptoAes256SaltedKey(key.secret);

      case ModuleWebCryptoAes256.TYPE:
        return new ModuleWebCryptoAes256(key.secret);

      case ModuleBlowfish.TYPE:
        return new ModuleBlowfish(key.secret);

      case ModuleTwoFish.TYPE:
        return new ModuleTwoFish(key.secret);

      case ModuleClearText.TYPE:
        return new ModuleClearText();

      default:
        throw new Error("Unknown key type: " + key.type);
    }
  }
}