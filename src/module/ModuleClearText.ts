import {WebStorageEncryptionModule} from "./WebStorageEncryptionModule";

/**
 * A baseline module that doesn't encrypt / decrypt data.
 */
export class ModuleClearText extends WebStorageEncryptionModule {
  public static readonly MODULE_ID = "Clear Text Storage";

  /**
   * Creates a new ModuleClearText instance.
   */
  constructor() {
    super(ModuleClearText.MODULE_ID);
  }

  /**
   * @inheritDoc
   */
  public async encrypt(plainText: string): Promise<string> {
    return plainText;
  }

  /**
   * @inheritDoc
   */
  public async decrypt(cypherText: string): Promise<string> {
    return cypherText;
  }
}