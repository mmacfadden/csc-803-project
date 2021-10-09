import { LocalStorage} from "node-localstorage"; 

import { KeyManager } from "../src/";
import { IEcryptionKey } from "../src/";
import { EncryptedStorage } from "../src/";
import { ModuleCryptoJsAES } from "../src/";
import { EncryptionModuleFactory } from "../src/";

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
