import { IEncryptionModule } from "../core/IEncryptionModule";

export class NoOpModule implements IEncryptionModule {
    static readonly TYPE = "NoOp";

    encrypt(clearText: string): string {
        return clearText;
    }
    
    decrypt(encrypted: string): string {
        return encrypted;
    }
}