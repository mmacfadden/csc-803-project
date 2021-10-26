import {Decryptor, Encryptor} from "triplesec";
import {SymmetricEncryptionBasedModule} from "./SymmetricEncryptionBasedModule";

export class ModuleTripleSec extends SymmetricEncryptionBasedModule {
  static readonly MODULE_ID = "Triple Sec";
  private readonly _encryptor: Encryptor;
  private readonly _decryptor: Decryptor;

  constructor(secret: string) {
    super(ModuleTripleSec.MODULE_ID, secret);
    const k = Buffer.from(secret, "utf-8");
    this._encryptor = new Encryptor({key: k});
    this._decryptor = new Decryptor({key: k});
  }

  public async encrypt(plainText: string): Promise<string> {
    const data = Buffer.from(plainText, "utf-8");

    return new Promise((resolve, reject) => {
      this._encryptor.run({data}, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res.toString("base64"));
      });
    });
  }

  public async decrypt(cypherText: string): Promise<string> {
    const data = Buffer.from(cypherText, "base64");

    return new Promise((resolve, reject) => {
      this._decryptor.run({data}, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve(res.toString());
      });
    });
  }
}