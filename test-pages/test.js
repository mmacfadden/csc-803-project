import {ModuleTwoFish} from "../src";

const {
  ModuleClearText,
  ModuleWebCryptoAes256SaltedKey,
  ModuleWebCryptoAes256,
  ModuleCryptoJsAes128,
  ModuleCryptoJsAes256,
  ModuleCryptoJsTripleDes,
  ModuleTripleSec,
  ModuleBlowfish,
  RandomStringGenerator,
  LoadTester
} = EncryptedStorage;

const encryption_secret = RandomStringGenerator.generate(200);
const masterPassword = "password";

const configs = [
  {type: ModuleClearText.TYPE, secret: encryption_secret},
  {type: ModuleWebCryptoAes256SaltedKey.TYPE, secret: encryption_secret},
  {type: ModuleWebCryptoAes256.TYPE, secret: encryption_secret},
  {type: ModuleCryptoJsAes128.TYPE, secret: encryption_secret},
  {type: ModuleCryptoJsAes256.TYPE, secret: encryption_secret},
  {type: ModuleCryptoJsTripleDes.TYPE, secret: encryption_secret},
  {type: ModuleTripleSec.TYPE, secret: encryption_secret},
  {type: ModuleBlowfish.TYPE, secret: encryption_secret},
  {type: ModuleTwoFish.TYPE, secret: encryption_secret}
];

async function* asyncGenerator() {
  for (const i in configs) {
    localStorage.clear();
    const tester = new LoadTester(configs[i], masterPassword, localStorage);
    yield tester.loadTest(100, 100);
  }
}

const run = async () => {
  for await (let result of asyncGenerator()) {

  }
}

run().catch(e => console.error(e));