import { IEncryptionModule } from "../module/IEncryptionModule";
import { StorageProxy } from "./StorageProxy";
import LZUTF8 from "lzutf8";
import * as lz from "lz-string";

export class EncryptedStorage implements Storage {
    private _encryptionModule: IEncryptionModule;
    private _storage: Storage;
    private _compress: boolean;

    [name: string]: any;

    constructor(encryptionModule: IEncryptionModule, 
                storage: Storage,
                compress: boolean = false) {
        this._encryptionModule = encryptionModule;
        this._storage = storage;
        this._compress = compress;

        return StorageProxy.create(this);
    }

    public get length(): number {
        return this._storage.length;
    }

    public clear(): void {
        this._storage.clear();
    }

    public setItem(key: string, value: string): void {
        if (this._compress) {
            // value = LZUTF8.compress(value, {outputEncoding: "StorageBinaryString"});
            value = lz.compressToUTF16(value);
        }

        let encrypted = this._encryptionModule.encrypt(value);
       
        this._storage.setItem(key, encrypted);
    }

    public getItem(key: string): string | null {
        const raw = this._storage.getItem(key);
        if (raw) {
            let value =  this._encryptionModule.decrypt(raw);
            if (this._compress) {
                // value = LZUTF8.decompress(value, {inputEncoding: "StorageBinaryString", outputEncoding: "String"});                
                value = lz.decompressFromUTF16(value) as string;
            }
            return value;
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