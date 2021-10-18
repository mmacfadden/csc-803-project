import { LocalStorage} from "node-localstorage"; 

import { LoadTester } from "../src/";
import { IEcryptionKey } from "../src/";
import { ModuleCryptoJsAES, ModuleNoOp } from "../src/";

const storage = new LocalStorage("./.localStorage/");
storage.clear();

const key: IEcryptionKey = {
    key: "Secret Symmetric Encryption Key",
    created: new Date(),
    type: ModuleCryptoJsAES.TYPE
}

const tester = new LoadTester(key, "password", storage);
tester.loadTest(1000, 1000);