import {LocalStorage} from "node-localstorage";
import {
    IEncryptionKey,
    LoadTester,
    ModuleClearText,
    ModuleCryptoJsAes256,
    ModuleCryptoJsAes128,
    ModuleCryptoJsTripleDes,
    ModuleTripleSec,
    ModuleWebCryptoAes256,
    ModuleWebCryptoAes256SaltedKey
} from "../src/";
import {RandomStringGenerator} from "../src/core/RandomStringGenerator";
import {Crypto} from "node-webcrypto-ossl";

if (global.crypto === undefined) {
    global.crypto = new Crypto({
        directory: ".key_storage"
    });
}

const storage = new LocalStorage("./.localStorage/");
storage.clear();

const encryption_secret = RandomStringGenerator.generate(200);
const masterPassword = "password";

const configs: IEncryptionKey[] = [
    {type: ModuleClearText.TYPE, secret: encryption_secret},
    {type: ModuleWebCryptoAes256SaltedKey.TYPE, secret: encryption_secret},
    {type: ModuleWebCryptoAes256.TYPE, secret: encryption_secret},
    {type: ModuleCryptoJsAes128.TYPE, secret: encryption_secret},
    {type: ModuleCryptoJsAes256.TYPE, secret: encryption_secret},
    {type: ModuleCryptoJsTripleDes.TYPE, secret: encryption_secret},
    {type: ModuleTripleSec.TYPE, secret: encryption_secret}
];


async function* asyncGenerator() {
    for (const i in configs) {
        const tester = new LoadTester(configs[i], masterPassword, storage);
        yield tester.loadTest(100, 100);
    }
  }

const run = async () => {
    for await (let result of asyncGenerator()) {

    }
}

run().catch(e => console.error(e));