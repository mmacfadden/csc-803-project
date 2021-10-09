import { IEncryptionModule } from "./IEncryptionModule";

export class ModuleNoOp implements IEncryptionModule {
    static readonly TYPE = "NoOp";

    encrypt(clearText: string): string {
        return clearText;
    }
    
    decrypt(encrypted: string): string {
        return encrypted;
    }
}