import {WebStorageEncryptionModule} from "./WebStorageEncryptionModule";

export class ModuleClearText extends WebStorageEncryptionModule {
  public static readonly MODULE_ID = "Clear Text Storage";

  constructor() {
    super(ModuleClearText.MODULE_ID);
  }

  public async encrypt(clearText: string): Promise<string> {
    return clearText;
  }

  public async decrypt(encrypted: string): Promise<string> {
    return encrypted;
  }
}