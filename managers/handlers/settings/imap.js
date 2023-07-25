const inquirer = require("inquirer");
const { v4: uuid } = require("uuid");
const clc = require("cli-color");
const { config, log, sleep } = require("../../utils.js");

const handleIMAP = async (saved) => {
  let imapRes = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ IMAP ]"),
      choices: ["Add Provider", "View Saved", "Clear All"],
    },
  ]);

  switch (imapRes.action) {
    case "Add Provider":
      let options = [
        {
          label: "GMAIL",
          value: "imap.gmail.com",
        },
        {
          label: "Yahoo",
          value: "imap.mail.yahoo.com",
        },
        {
          label: "Outlook",
          value: "imap-mail.outlook.com",
        },
        {
          label: "AOL",
          value: "imap.aol.com",
        },
        {
          label: "iCloud",
          value: "imap.mail.me.com",
        },
        {
          label: "Zoho",
          value: "imap.zoho.com",
        },
        {
          label: "FastMail",
          value: "imap.fastmail.com",
        },
        {
          label: "GMX",
          value: "imap.gmx.com",
        },
        {
          label: "Yandex",
          value: "imap.yandex.com",
        },
      ];
      let addImapRes = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "IMAP Provider:",
          choices: options.map((x) => x.label),
        },
        {
          type: "input",
          name: "email",
          message: "IMAP Email:",
        },
        {
          type: "password",
          name: "password",
          message:
            "IMAP Password (If 2FA is enabled, check if you need an app password - then use that!):",
        },
      ]);

      let obj = {
        email: addImapRes.email,
        password: addImapRes.password,
        provider: options.find((x) => x.label === addImapRes.action).value,
        id: uuid(),
      };
      if (!saved.imap) {
        saved.imap = [];
      }
      saved.imap.push(obj);
      await config.set("voro-cli", saved);
      log("Added provider", "success");
      await sleep(2500);
      await global.run();
      break;
    case "View Saved":
      if (!saved.imap || saved.imap.length === 0) {
        log("No providers are saved", "error");
      } else {
        log(`[ IMAP (${saved.imap.length}) ]`, "success");
        console.table(saved.imap, ["provider", "email", "password"]);
      }
      await sleep(2500);
      await global.run();
      break;
    case "Clear All":
      if (saved.imap) {
        saved.imap = [];
        await config.set("voro-cli", saved);
        log("All providers have been removed", "success");
      } else {
        log("There are no providers saved.", "error");
      }
      await sleep(2500);
      await global.run();
      break;
  }
};

module.exports = {
  handleIMAP,
};
