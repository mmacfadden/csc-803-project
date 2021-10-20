import {EncryptionModule} from "./EncryptionModule";

export abstract class KeyBasedModule extends EncryptionModule {
  protected readonly _encryptionSecret: string;

  protected constructor(type: string, secret: string) {
    super(type);
    this._encryptionSecret = secret;
  }
}
