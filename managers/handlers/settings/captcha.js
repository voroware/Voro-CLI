const inquirer = require("inquirer");
const clc = require("cli-color");
const { config, log, sleep } = require("../../utils.js");

const handleCaptcha = async (saved) => {
  let captchaRes = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ CAPTCHA ]"),
      choices: ["Add Provider", "View Saved", "Clear All"],
    },
  ]);
  switch (captchaRes.action) {
    case "Add Provider":
      let captchaRes2 = await inquirer.prompt([
        {
          type: "list",
          name: "provider",
          message: "Captcha Provider:",
          choices: ["2captcha", "CapMonster", "CapSolver"],
        },
        {
          type: "input",
          name: "apiKey",
          message: "Paste API Key:",
        },
      ]);
      if (!saved.captcha) {
        saved.captcha = {
          twocaptcha: "",
          capmonster: "",
          capsolver: "",
        };
      }

      switch (captchaRes2.action) {
        case "2captcha":
          saved.captcha.twocaptcha = captchaRes2.apiKey;
          break;
        case "CapMonster":
          saved.captcha.capmonster = captchaRes2.apiKey;
          break;
        case "CapSolver":
          saved.captcha.capsolver = captchaRes2.apiKey;
          break;
      }

      await config.set("voro-cli", saved);
      log("Provider settings updated.", "success");
      await sleep(2500);
      await global.run();
      break;
    case "View Saved":
      if (!saved.captcha) {
        log("No providers saved!", "error");
      } else {
        log("Captcha Providers:", "success");
        log("2captcha: " + saved.captcha.twocaptcha, "info");
        log("CapMonster: " + saved.captcha.capmonster, "info");
        log("CapSolver: " + saved.captcha.capsolver, "info");
      }
      await sleep(2500);
      await global.run();
      break;
    case "Clear All":
      if (saved.captcha) {
        saved.captcha = {
          twocaptcha: "",
          capmonster: "",
          capsolver: "",
        };
        await config.set("voro-cli", saved);
        log("Captcha Providers cleared!", "success");
      } else {
        log("No Captcha Providers saved!", "error");
      }

      await sleep(2500);
      await global.run();
      break;
  }
};

module.exports = {
  handleCaptcha,
};
