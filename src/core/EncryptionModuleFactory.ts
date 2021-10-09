import { CryptoJsAES } from "../modules/CryptoJsAES";
import { NoOpModule } from "../modules/NoOpModule";
import { IEcryptionKey } from "./IEncryptionKey";
import { IEncryptionModule } from "./IEncryptionModule";

export class EncryptionModuleFactory {
    static createModule(key: IEcryptionKey): IEncryptionModule {
        switch(key.type) {
            case CryptoJsAES.TYPE:
                return new CryptoJsAES(key.key);

            case NoOpModule.TYPE:
                return new NoOpModule();
            
            default:
                throw new Error("Unknown key type: " + key.type);
        }
    }
}