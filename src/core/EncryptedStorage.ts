import { IEncryptionModule } from "../module/IEncryptionModule";
import { StorageProxy } from "./StorageProxy";

export class EncryptedStorage {
    private _encryptionModule: IEncryptionModule;
    private _storage: Storage;

    [name: string]: any;

    constructor(encryptionModule: IEncryptionModule, storage: Storage) {
        this._encryptionModule = encryptionModule;
        this._storage = storage;

        return StorageProxy.create(this);
    }

    public get length(): number {
        return this._storage.length;
    }

    public clear(): void {
        this._storage.clear();
    }

    public setItem(key: string, value: string): void {
        const encrypted = this._encryptionModule.encrypt(value);
        this._storage.setItem(key, encrypted);
    }

    public getItem(key: string): string | null {
        const raw = this._storage.getItem(key);
        if (raw) {
            return this._encryptionModule.decrypt(raw);
        } else {
            return null;
        }
        
    }
    
    public key(index: number): string | null {
        return this._storage.key(index);
    }
    
    public removeItem(key: string): void {
        this._storage.removeItem(key);
    }
}