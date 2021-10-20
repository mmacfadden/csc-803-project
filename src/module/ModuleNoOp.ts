import {EncryptionModule} from "./EncryptionModule";

export class ModuleClearText extends EncryptionModule {
  public static readonly TYPE = "Clear Text Storage";

  constructor() {
    super(ModuleClearText.TYPE);
  }

  public async encrypt(clearText: string): Promise<string> {
    return clearText;
  }

  public async decrypt(encrypted: string): Promise<string> {
    return encrypted;
  }
}