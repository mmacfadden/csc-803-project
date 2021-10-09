import { ModuleCryptoJsAES } from "./ModuleCryptoJsAES";
import { ModuleNoOp } from "./ModuleNoOp";
import { IEcryptionKey } from "../key";
import { IEncryptionModule } from "./IEncryptionModule";

export class EncryptionModuleFactory {
    public static createModule(key: IEcryptionKey): IEncryptionModule {
        switch(key.type) {
            case ModuleCryptoJsAES.TYPE:
                return new ModuleCryptoJsAES(key.key);

            case ModuleNoOp.TYPE:
                return new ModuleNoOp();
            
            default:
                throw new Error("Unknown key type: " + key.type);
        }
    }
}