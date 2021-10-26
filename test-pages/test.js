const {LoadTester} = EncryptedStorage;

//
// UI Elements
//
const status = $("#status");
const resultsTextArea = $("#results");
const runButton = $("#run");
const downloadButton = $("#download");

// Tracks the current test's status item.
let currentTest = null;

// Used to be notified of test progress.
const hooks = {
  testStarted(module) {
    currentTest = $(`<li class="list-group-item">Testing "${module}"...</li>`);
    status.append(currentTest);
    scrollToBottomOfStatus();
  },
  testFinished(module) {
    currentTest.append(" Done");
    currentTest = null;
  }
}

/**
 * Executes the load test procedure.
 */
async function loadTest() {
  status.empty();
  resultsTextArea.val("");

  runButton.prop("disabled", true);
  downloadButton.prop("disabled", true);

  try {
    const results = await LoadTester.testAll("password", localStorage, true, hooks);
    currentTest = $(`<li class="list-group-item">All tests complete.</li>`);
    scrollToBottomOfStatus();
    const data = results.join("\n");
    resultsTextArea.val(data);

    runButton.prop("disabled", false);
    downloadButton.prop("disabled", false);
  } catch (e) {
    runButton.prop("disabled", false);
    downloadButton.prop("disabled", true);
    status.append($(`<div>Error (see console for more details): ${e.message}</div>`));
    console.log(e);
  }
}

/**
 * A helper method the cases the status <ul> to scroll to
 * the bottom to show the last item added.
 */
function scrollToBottomOfStatus() {
  status.scrollTop(status[0].scrollHeight);
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
