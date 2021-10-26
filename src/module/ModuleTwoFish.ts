import {twofish, ITwoFish} from "twofish";
import {SymmetricEncryptionBasedModule} from "./SymmetricEncryptionBasedModule";

export class ModuleTwoFish extends SymmetricEncryptionBasedModule {
  public static readonly MODULE_ID = "TwoFish (wouldgo)";

  private readonly _twofish: ITwoFish;
  private readonly _key: number[];

  constructor(secret: string) {
    super(ModuleTwoFish.MODULE_ID, secret);
    this._twofish = twofish();
    this._key = this._twofish.stringToByteArray(secret);
  }

  public async encrypt(plainText: string): Promise<string> {
    const ptBytes = [...Buffer.from(plainText, "utf-8")];
    const ctBytes = this._twofish.encrypt(this._key, ptBytes);
    // There seems to be an issue when decrypting that that decrypted
    // data gets put into an array of the same size as the encrypted
    // data, which leaves 0's at the end. So we push on the length
    // of the pt data so we can truncated it later.
    ctBytes.unshift(ptBytes.length);
    return Buffer.from(ctBytes).toString("base64");
  }

  public async decrypt(cypherText: string): Promise<string> {
    const ctBytes = [...Buffer.from(cypherText, "base64")];
    const length = ctBytes.shift()
    const ptBytes = this._twofish.decrypt(this._key, ctBytes);
    const truncated = ptBytes.slice(0, length);
    return Buffer.from(truncated).toString("utf-8");
  }
}
