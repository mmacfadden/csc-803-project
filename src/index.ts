import { LocalStorage} from "node-localstorage"; 

import { KeyManager } from "./key/KeyManager";
import { IEcryptionKey } from "./key/";
import { EncryptedStorage } from "./core/";
import { ModuleCryptoJsAES } from "./module/";
import { EncryptionModuleFactory } from "./module/";

global.localStorage = new LocalStorage("./.localStorage/");

const keyManager = new KeyManager();

const key: IEcryptionKey = {
    key: "Secret Symmetric Encryption Key",
    created: new Date(),
    type: ModuleCryptoJsAES.TYPE
}

keyManager.setKey(key, "password");

const readKey = keyManager.getKey("password");

console.log(readKey);

const em = EncryptionModuleFactory.createModule(key);
const encStorage = new EncryptedStorage(em, localStorage);

encStorage.setItem("aKey", "value");
console.log(encStorage.getItem("aKey"));
