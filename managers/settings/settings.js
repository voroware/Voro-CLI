const inquirer = require("inquirer");
const { handleWebhookManager } = require(`../handlers/settings/webhooks.js`);
const { handleSMS } = require(`../handlers/settings/sms.js`);
const { handleCaptcha } = require("../handlers/settings/captcha.js");
const { handleIMAP } = require("../handlers/settings/imap.js");
const clc = require("cli-color");
const { fetchSavedConfig } = require("../utils.js");

const handleSettingsManager = async () => {
  let response = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ CONFIGURATION ]"),
      choices: ["IMAP", "SMS", "Captcha", "Webhooks"],
    },
  ]);
  let saved = await fetchSavedConfig();
  switch (response.action) {
    case "Webhooks":
      await handleWebhookManager(saved);
      break;
    case "SMS":
      await handleSMS(saved);
      break;
    case "Captcha":
      await handleCaptcha(saved);
      break;
    case "IMAP":
      await handleIMAP(saved);
      break;
  }
};

module.exports = {
  handleSettingsManager,
};
