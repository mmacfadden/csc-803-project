import { 
    IEcryptionKey,
    IEncryptionModule,
    KeyManager,
    EncryptedStorage,
    EncryptionModuleFactory
} from "../";
import { RandomStringGenerator } from "./RandomStringGenerator";

export class LoadTester {
    private readonly _keyManager: KeyManager;
    private _encModule: IEncryptionModule;
    private _storage: EncryptedStorage;
    private _key: IEcryptionKey;


    constructor(
        key: IEcryptionKey, 
        password: string, 
        storage: Storage
        ) {
        this._keyManager = new KeyManager(storage);
        this._keyManager.setKey(key, password);

        this._key = this._keyManager.getKey(password);
        this._encModule = EncryptionModuleFactory.createModule(this._key);

        this._storage = new EncryptedStorage(this._encModule, storage, false);
    }

    public loadTest(entryCount: number, valueSize: number): void {

        const value = RandomStringGenerator.generate(valueSize);

        const startTime = Date.now();

        for (let i = 0; i < entryCount; i++) {
            const k = `key_${i}`;
            this._storage.setItem(k, value);
            this._storage.getItem(k);
        }

        const endTime = Date.now();

        console.log(`Write and read ${entryCount} items with ${this._key.type} in ${endTime - startTime}ms`);
    }
}