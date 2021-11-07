import {LoadTester, CsvGenerator, InMemoryStorage} from "../src/";
import minimist from "minimist";
import {LocalStorage} from "node-localstorage";
import {Crypto} from "node-webcrypto-ossl";
import fs from "fs-extra";

const args = minimist(process.argv.slice(2));

globalThis.crypto = new Crypto({
    directory: ".key_storage"
});

const storage = args["storage"] === "disk" ?
  new LocalStorage("./.local_storage/") :
  new InMemoryStorage();

storage.clear();

LoadTester
  .testAll( 100, 100, storage, false)
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