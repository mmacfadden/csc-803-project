export abstract class EncryptionModule {
  private readonly _type: string;

  protected constructor(type: string) {
    this._type = type;
  }

  public type(): string {
    return this._type;
  }

  public async init(): Promise<void> {

  }

  public abstract encrypt(clearText: string): Promise<string>;

  public abstract decrypt(encrypted: string): Promise<string>;
}