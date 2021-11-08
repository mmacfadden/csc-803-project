import {
  CsvGenerator,
  InMemoryStorage,
  LoadTester,
  ModuleBlowfish,
  ModuleClearText,
  ModuleCryptoJsAes128,
  ModuleCryptoJsAes256,
  ModuleCryptoJsTripleDes,
  ModuleNodeWebCryptoAes128,
  ModuleNodeWebCryptoAes256,
  ModuleTripleSec,
  ModuleTwoFish,
  ModuleWebCryptoAes128,
  ModuleWebCryptoAes256,
  RandomStringGenerator
} from "../src/";
import minimist from "minimist";
import {LocalStorage} from "node-localstorage";
import fs from "fs-extra";
import {webcrypto} from "crypto";

const args = minimist(process.argv.slice(2));

// Use nodes web crypto implementation.
globalThis.crypto = webcrypto as any;

const storage = args["storage"] === "disk" ?
  new LocalStorage("./.local_storage/") :
  new InMemoryStorage();

storage.clear();

const encryption_secret = RandomStringGenerator.generate(200);
const encryptionConfigs = [
  {moduleId: ModuleClearText.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleNodeWebCryptoAes128.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleNodeWebCryptoAes256.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleWebCryptoAes128.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleWebCryptoAes256.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleCryptoJsAes128.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleCryptoJsAes256.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleCryptoJsTripleDes.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleTripleSec.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleBlowfish.MODULE_ID, secret: encryption_secret},
  {moduleId: ModuleTwoFish.MODULE_ID, secret: encryption_secret},
];

LoadTester
  .testEncryptionConfigs(encryptionConfigs, 10000, 1000, storage, false)
  .then(results => {
    const csvFile = args["csv"];
    if (csvFile) {
      const csv = CsvGenerator.generateCsv(results);
      fs.writeFileSync(csvFile, csv);
    }

    console.log("");
    console.table(results);
    console.log("");
  })
  .catch(e => console.error(e));