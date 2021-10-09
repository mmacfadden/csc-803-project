export interface IEncryptionModule {
    encrypt(clearText: string): string;
    decrypt(encrypted: string): string;
}