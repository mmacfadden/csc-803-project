import { LocalStorage} from "node-localstorage"; 

import { KeyManager } from "./core/KeyManager";
import { IEcryptionKey } from "./core/IEncryptionKey";
import { EncryptedStorage } from "./core/EncryptedStorage";
import { CryptoJsAES } from "./modules/CryptoJsAES";
import { EncryptionModuleFactory } from "./core/EncryptionModuleFactory";

global.localStorage = new LocalStorage("./.localStorage/");

const keyManager = new KeyManager();

const key: IEcryptionKey = {
    key: "Secret Symmetric Encryption Key",
    created: new Date(),
    type: CryptoJsAES.TYPE
}

keyManager.setKey(key, "password");

const readKey = keyManager.getKey("password");

console.log(readKey);

const em = EncryptionModuleFactory.createModule(key);
const encStorage = new EncryptedStorage(em, localStorage);

encStorage.setItem("aKey", "value");
console.log(encStorage.getItem("aKey"));
