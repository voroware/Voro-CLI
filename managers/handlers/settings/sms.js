const inquirer = require("inquirer");
const clc = require("cli-color");
const { config, log, sleep } = require("../../utils.js");

const handleSMS = async (saved) => {
  let smsRes = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ SMS ]"),
      choices: ["Add Provider", "View Saved", "Clear All"],
    },
  ]);
  switch (smsRes.action) {
    case "Add Provider":
      let addNewSmsRes = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "Select SMS provider to add:",
          choices: ["5sim.net"],
        },
        {
          type: "input",
          name: "apiKey",
          message: "Paste API Key:",
        },
      ]);
      if (!saved.sms) {
        saved.sms = {
          fivesim: "",
        };
      } else {
        if (addNewSmsRes.action === "5sim.net") {
          saved.sms.fivesim = addNewSmsRes.apiKey;
        }
        await config.set("voro-cli", saved);
      }
      await config.set("voro-cli", saved);
      log("SMS Provider updated!", "success");
      await sleep(2500);
      await global.run();
      break;
    case "View Saved":
      if (!saved.sms) {
        log("There are no provider API keys saved", "error");
      } else {
        log("[ PROVIDERS ]", "success");
        log("5sim.net: " + saved.sms.fivesim, "info");
      }
      await sleep(2500);
      await global.run();
      break;
    case "Clear All":
      if (saved.sms) {
        saved.sms = {
          fivesim: "",
          smsactivate: "",
        };
        await config.set("voro-cli", saved);
      }
      log("All API keys have been deleted.", "success");
      await sleep(2500);
      await global.run();
      break;
  }
};

module.exports = {
  handleSMS,
};
