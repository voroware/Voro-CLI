const inquirer = require("inquirer");
const { v4: uuid } = require("uuid");
const clc = require("cli-color");

const SpoofBrowser = require(`./tools/spoofBrowser.js`);
const { sendViews } = require(`./tools/ebayViews.js`);
const { sendMercariViews } = require(`./tools/mercariViews.js`);
const { sendOfferUpViews } = require(`./tools/offerUpViews.js`);

const handleToolBox = async () => {
  let response = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ TOOLS ]"),
      choices: [
        "eBay View Bot",
        "Mercari View Bot",
        "OfferUp View Bot",
        "Spoof Browser",
      ],
    },
  ]);

  let userRes;
  switch (response.action) {
    case "eBay View Bot":
      userRes = await inquirer.prompt([
        {
          type: "input",
          name: "url",
          message: "eBay Listing URL:",
        },
        {
          type: "input",
          name: "sendQty",
          message: "How many views would you like to send?",
        },
        {
          type: "confirm",
          name: "useProxies",
          message: "Use proxies?",
        },
        {
          type: "confirm",
          name: "autoBoost",
          message: "Would you like to auto boost this listing?",
        },
      ]);

      await sendViews(
        userRes.url,
        userRes.useProxies,
        userRes.sendQty,
        userRes.autoBoost
      );
      await global.run();
      break;
    case "Mercari View Bot":
      userRes = await inquirer.prompt([
        {
          type: "input",
          name: "url",
          message: "Mercari Listing URL:",
        },
        {
          type: "input",
          name: "sendQty",
          message: "How many views would you like to send?",
        },
        {
          type: "confirm",
          name: "useProxies",
          message: "Use proxies?",
        },
        {
          type: "confirm",
          name: "autoBoost",
          message: "Would you like to auto boost this listing?",
        },
      ]);

      await sendMercariViews(
        userRes.url,
        userRes.useProxies,
        userRes.sendQty,
        userRes.autoBoost
      );
      await global.run();
      break;
    case "Spoof Browser":
      userRes = await inquirer.prompt([
        {
          type: "list",
          name: "browser",
          message: "Select a browser:",
          choices: ["Chrome", "Firefox"],
        },
        {
          type: "input",
          name: "url",
          message: "Desired URL:",
        },
        {
          type: "input",
          name: "browserCount",
          message: "Browser Quantity:",
        },
        {
          type: "confirm",
          name: "useProxies",
          message: "Use Proxies?",
        },
      ]);

      let obj = {
        browser: userRes.browser,
        url: userRes.url,
        slowOpen: userRes.slowOpen,
        useProxies: userRes.useProxies,
      };

      for (let i = 1; i <= userRes.browserCount; i++) {
        let t = new SpoofBrowser(obj.browser, obj.url, obj.useProxies, uuid());
        t.launch();
      }
      break;
    case "OfferUp View Bot":
      userRes = await inquirer.prompt([
        {
          type: "input",
          name: "url",
          message: "OfferUp Listing URL:",
        },
        {
          type: "input",
          name: "sendQty",
          message: "How many views would you like to send?",
        },
        {
          type: "confirm",
          name: "useProxies",
          message: "Use proxies?",
        },
        {
          type: "confirm",
          name: "autoBoost",
          message: "Would you like to auto boost this listing?",
        },
      ]);

      await sendOfferUpViews(
        userRes.url,
        userRes.sendQty,
        userRes.useProxies,
        userRes.autoBoost
      );
      await global.run();
      break;
  }
};

module.exports = {
  handleToolBox,
};
