import {LoadTester} from "../src/";
import {LocalStorage} from "node-localstorage";
import {Crypto} from "node-webcrypto-ossl";

if (global.crypto === undefined) {
    global.crypto = new Crypto({
        directory: ".key_storage"
    });
}

const storage = new LocalStorage("./.localStorage/");
storage.clear();

const masterPassword = "password";

LoadTester
  .testAll(masterPassword, storage, false)
  .then(results => {
      console.log(results.join("\n"));
  })
  .catch(e => console.error(e));