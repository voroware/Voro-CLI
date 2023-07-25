const inquirer = require("inquirer");
const clc = require("cli-color");

const { logLogo } = require(`./utils.js`);
const { handleTasksManager } = require(`./task/tasks.js`);
const { handleSettingsManager } = require(`./settings/settings.js`);
const { handleToolBox } = require(`./toolbox/tools.js`);
const { handleProxyManager } = require(`./handlers/proxies/proxies.js`);

const run = async () => {
  console.clear();
  logLogo();
  process.title = `VoroCLI - Version: ${global.version}`;
  console.log("");
  let answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ WELCOME TO VORO CLI ]"),
      choices: [`Modules`, "Proxies", "Tools", "Config", "Exit"],
    },
  ]);

  switch (answer.action) {
    case "Exit":
      process.exit();
    case "Modules":
      await handleTasksManager();
      break;
    case "Config":
      await handleSettingsManager();
      break;
    case "Tools":
      await handleToolBox();
      break;
    case "Proxies":
      await handleProxyManager();
      break;
  }
};

module.exports = run;
