import { IEncryptionModule } from "../core/IEncryptionModule";

export abstract class KeyBasedModule implements IEncryptionModule {
    protected _key: string;

    constructor(key: string) {
        this._key = key;
    }

    public abstract encrypt(clearText: string): string;
        
    public abstract decrypt(encrypted: string): string;
}
