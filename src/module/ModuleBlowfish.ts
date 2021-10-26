import Blowfish from "egoroof-blowfish";
import {SymmetricEncryptionBasedModule} from "./SymmetricEncryptionBasedModule";
import {RandomStringGenerator} from "../core";

export class ModuleBlowfish extends SymmetricEncryptionBasedModule {
  public static readonly MODULE_ID = "Blowfish (egoroof)";

  private readonly _bf: Blowfish;

  constructor(secret: string) {
    super(ModuleBlowfish.MODULE_ID, secret);
    this._bf = new Blowfish(this._encryptionSecret, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
    this._bf.setIv(RandomStringGenerator.generate(8));
  }

  public async encrypt(plainText: string): Promise<string> {
    return Buffer.from(this._bf.encode(plainText)).toString("base64");
  }

  public async decrypt(cypherText: string): Promise<string> {
    const data = Uint8Array.from(Buffer.from(cypherText, "base64"))
    return this._bf.decode(data, Blowfish.TYPE.STRING);
  }
}
