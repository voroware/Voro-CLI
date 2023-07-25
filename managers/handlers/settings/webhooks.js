const inquirer = require("inquirer");
const { testWebhook } = require(`../../utils.js`);
const clc = require("cli-color");
const { config, log, sleep } = require("../../utils.js");

const handleWebhookManager = async (saved) => {
  let response = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ WEBHOOKS ]"),
      choices: ["Add Webhook", "View Saved", "Test All", "Clear All"],
    },
  ]);

  switch (response.action) {
    case "Add Webhook":
      let webhookToSaveResp = await inquirer.prompt([
        {
          type: "input",
          name: "addWebhook",
          message: "Paste Discord Webhook:",
        },
      ]);

      if (
        webhookToSaveResp.addWebhook.startsWith(
          "https://discord.com/api/webhooks"
        )
      ) {
        if (!saved.webhooks) {
          saved.webhooks = [];
        }
        saved.webhooks.push(webhookToSaveResp.addWebhook);
        await config.set("voro-cli", saved);
        log("Webhook has been added", "success");
      }
      await sleep(2500);
      await global.run();
      break;
    case "View Saved":
      if (!saved.webhooks || saved.webhooks.length === 0) {
        log("No webhooks saved!", "error");
      } else {
        log("[ SAVED WEBHOOKS ]", "info");
        for (let hook of saved.webhooks) {
          log(`URL: ${hook}`, "info");
        }
      }
      await sleep(2500);
      await global.run();
      break;
    case "Test All":
      if (!saved.webhooks || saved.webhooks.length === 0) {
        log("No webhooks saved!", "error");
      } else {
        log("Testing Webhooks...", "info");
        saved.webhooks.forEach((webhook) => {
          testWebhook(webhook);
        });
      }
      await sleep(2500);
      await global.run();
      break;
    case "Clear All":
      if (saved.webhooks) {
        saved.webhooks = [];
        await config.set("voro-cli", saved);
        log("All webhooks have been cleared", "success");
      } else {
        log("No webhooks to clear!", "error");
      }
      await sleep(2500);
      await global.run();
      break;
  }
};

module.exports = {
  handleWebhookManager,
};
