const path = require("path");
const Perf = require("../src/perf.js");
const dsl = require("./dsl/simple-typing").dsl;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function sampleTest(iteration) {
  const perf = new Perf({ iteration });
  try {
    await perf.launch();

    const page = perf.getPage();
    await perf.loadDSL(dsl);

    const selector = "input.bp3-input"; // Input selector
    await page.waitForSelector(selector);
    const input = await page.$(selector);

    await perf.startTrace("Edit input");
    await page.type(selector, "Hello Appsmith");
    await perf.stopTrace();

    await perf.startTrace("Clear input");
    await input.click({ clickCount: 3 });
    await input.press("Backspace");
    await perf.stopTrace();

    await perf.startTrace("Edit input again");
    await page.type(selector, "Howdy satish");
    await perf.stopTrace();

    await perf.generateReport();
    await perf.close();
  } catch (e) {
    await perf.handleRejections(e);
    await perf.close();
  }
}

async function runTests() {
  for (let i = 0; i < 5; i++) {
    await sampleTest(i + 1);
  }
}

runTests();
