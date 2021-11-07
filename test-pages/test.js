const {LoadTester, CsvGenerator, ModuleBlowfish,
  ModuleClearText, ModuleCryptoJsAes128, ModuleCryptoJsAes256, ModuleCryptoJsTripleDes,
  ModuleNodeWebCryptoAes128,
  ModuleNodeWebCryptoAes256, ModuleTripleSec, ModuleTwoFish, ModuleWebCryptoAes128, ModuleWebCryptoAes256,
  RandomStringGenerator} = EncryptedStorage;

//
// UI Elements
//
const status = $("#status");

const runButton = $("#run");
const downloadButton = $("#download");

const resultTable = $("#results-table");
const resultsTextArea = $("#results-csv");

// Tracks the current test's status item.
let inProgressRow = null;
let testCounter = 0;
let totalTests = 0;

// Used to be notified of test progress.
const hooks = {
  testingStarted(testConfigs){
    totalTests = testConfigs.length;
    testCounter = 0;
  },
  testStarted(module) {
    testCounter++;
    status.html(`Test ${testCounter} of ${totalTests}:  ${module}`);
    inProgressRow = $(`<tr><td>${module}</td><td colspan="5">In Progress</td></tr>`);
    resultTable.append(inProgressRow);
  },
  testFinished(result) {
    inProgressRow.remove();
    appendResultRow(result);
    inProgressRow = null;
  }
}

/**
 * Executes the load test procedure.
 */
async function loadTest() {
  status.empty();
  resultTable.empty();
  resultsTextArea.val("");

  runButton.prop("disabled", true);
  downloadButton.prop("disabled", true);

  try {
    const encryption_secret = RandomStringGenerator.generate(200);
    const encryptionConfigs = [
      {moduleId: ModuleClearText.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleWebCryptoAes128.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleWebCryptoAes256.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleCryptoJsAes128.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleCryptoJsAes256.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleCryptoJsTripleDes.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleTripleSec.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleBlowfish.MODULE_ID, secret: encryption_secret},
      {moduleId: ModuleTwoFish.MODULE_ID, secret: encryption_secret},
    ];

    const results = await LoadTester.testEncryptionConfigs(
        encryptionConfigs, 100, 100, localStorage, true, hooks);

    const csvData = CsvGenerator.generateCsv(results);
    resultsTextArea.val(csvData);

    runButton.prop("disabled", false);
    downloadButton.prop("disabled", false);

    status.html(`All tests complete.`);
  } catch (e) {
    runButton.prop("disabled", false);
    downloadButton.prop("disabled", true);
    status.innerHTML = `Error (see console for more details): ${e.message}`;
    console.log(e);
  }
}

/**
 * Adds a new test result to the result table.
 */
function appendResultRow(result) {
  const row = $("<tr>");

  row.append($(`<td class="string">${result.moduleId}</td>`));
  row.append($(`<td class="string">${result.entryCount}</td>`));
  row.append($(`<td class="number">${round(result.totalTimeMs, 3)}</td>`));
  row.append($(`<td class="number">${round(result.averageReadTimeMs, 3)}</td>`));
  row.append($(`<td class="number">${round(result.averageWriteTimeMs, 3)}</td>`));
  row.append($(`<td class="number">${round(result.averageRearWriteTimeMs, 3)}</td>`));

  resultTable.append(row);
}

/**
 * A helper method to round a number to a specific number of digits.
 */
function round(value, decimals) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(multiplier * value) / multiplier;
}

/**
 * A helper method to download the contents of the results text
 * area as a CSV file.
 */
function downloadCsv() {
  const textFileAsBlob = new Blob([resultsTextArea.val()], {type: 'text/plain'});
  const downloadLink = document.createElement("a");
  downloadLink.download = "load-test-results.csv";
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();

  if (downloadLink.parentNode) {
    downloadLink.parentNode.removeChild(downloadLink);
  }
}
