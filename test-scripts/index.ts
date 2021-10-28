import {LoadTester, CsvGenerator} from "../src/";
import {LocalStorage} from "node-localstorage";
import {Crypto} from "node-webcrypto-ossl";

if (globalThis.crypto === undefined) {
  globalThis.crypto = new Crypto({
    directory: ".key_storage"
  });
}

const storage = new LocalStorage("./.localStorage/");
storage.clear();

const masterPassword = "password";

LoadTester
  .testAll(masterPassword, storage, false)
  .then(results => {
    const csv = CsvGenerator.generateCsv(results);
    console.log(csv);
  })
  .catch(e => console.error(e));