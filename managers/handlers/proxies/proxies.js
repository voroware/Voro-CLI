const inquirer = require("inquirer");
const { getProxyFile, parseProxyString, log, sleep } = require(`../../utils.js`);
const { HttpsProxyAgent } = require("https-proxy-agent");
const axios = require("axios");
const clc = require("cli-color");

const handleProxyManager = async () => {
  let response = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ PROXIES ]"),
      choices: ["Test saved proxies"],
    },
  ]);

  switch (response.action) {
    case "Test saved proxies":
      let savedProxies = await getProxyFile();
      if (savedProxies === null) {
        log("No proxies loaded!", "error");
      } else {
        savedProxies = savedProxies.split("\n");
        log(`Testing ${savedProxies.length} proxies...`, "warn");
        let promises = [];
        for (let proxy of savedProxies) {
          let formatted = parseProxyString(proxy);
          if (formatted) {
            promises.push(testProxy(formatted));
          }
        }
        await Promise.allSettled(promises);
        log(
          `Finished testing ${savedProxies.length} proxies!`,
          "success"
        );
      }
      break;
  }

  await sleep(2500)
  await global.run();
};

const testProxy = async (proxy) => {
  try {
    log(`Testing ${proxy.replace("http://", "")}`, "info");
    let start = new Date();
    let t = await axios("https://api.ipify.org/", {
      timeout: 5000,
      httpsAgent: new HttpsProxyAgent(proxy),
    });
    let end = new Date() - start;
    log(
      `[LATENCY]: ${end}ms - ${proxy.replace("http://", "")}`,
      "info"
    );
  } catch (e) {
    log(
      `Connection Failed - ${proxy.replace("http://", "")}`,
      "error"
    );
  }
};

module.exports = {
  handleProxyManager,
};
