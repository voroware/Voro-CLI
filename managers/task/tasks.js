const inquirer = require("inquirer");
const Conf = require("conf");
const { v4: uuidv4 } = require("uuid");
const clc = require("cli-color");
const { config, log, fetchSavedConfig, sleep } = require("../utils.js");

const kkModule = require(`./tasks/deals/krispy kreme/KK.js`);
const cpkModule = require(`./tasks/deals/california pizza kitchen/CPK.js`);
const outlookModule = require(`./tasks/generators/outlook/Outlook.js`);
const walmartModule = require(`./tasks/generators/walmart/Walmart.js`);
const shopifyModule = require(`./tasks/generators/shopify/Shopify.js`);
const targetAccGen = require(`./tasks/generators/target/Target.js`);
const ebayGen = require(`./tasks/generators/ebay/eBay.js`);
const twitterGen = require(`./tasks/generators/twitter/Twitter.js`);
const gmailGen = require(`./tasks/generators/gmail/GMAIL.js`);

const handleTasksManager = async () => {
  let response = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: clc.cyanBright("[ MODULES ]"),
      choices: [`Run All`, "Create", "View All", "Clear All"],
    },
  ]);
  let saved = (await fetchSavedConfig()).tasks;
  let savedImap = (await fetchSavedConfig()).imap;
  switch (response.action) {
    case "Run All":
      if (saved.length > 0) {
        let moduleMap = {
          "Krispy Kreme": kkModule,
          "California Pizza Kitchen": cpkModule,
          Outlook: outlookModule,
          Walmart: walmartModule,
          Shopify: shopifyModule,
          "Target Gen": targetAccGen,
          "eBay Gen": ebayGen,
          Twitter: twitterGen,
          GMAIL: gmailGen,
        };
        let toStart = saved
          .map((task) => {
            const Module = moduleMap[task.module];
            return new Module(task);
          })
          .filter(Boolean);
        await Promise.all(toStart.map((x) => x.run()));
      } else {
        log("No tasks found.", "error");
      }
      break;
    case "Create":
      let moduleCat = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "Select Module category:",
          choices: ["Account Generators", "Food Deals"],
        },
      ]);
      switch (moduleCat.action) {
        case "Account Generators":
          let accGenTask = await inquirer.prompt([
            {
              type: "list",
              name: "action",
              message: "Select Generator:",
              choices: [
                "Shopify",
                "Walmart",
                "Target",
                "GMAIL",
                "eBay",
                "Twitter",
                "Outlook",
              ],
            },
          ]);

          switch (accGenTask.action) {
            case "Shopify":
              let shopifyGen = await inquirer.prompt([
                {
                  type: "input",
                  name: "site",
                  message: "Target Site:",
                },
                {
                  type: "input",
                  name: "catchall",
                  message: "Catchall:",
                },
                {
                  type: "input",
                  name: "taskQty",
                  message: "How many tasks would you like to create?",
                },
                {
                  type: "confirm",
                  name: "useProxies",
                  message: "Use proxies?",
                },
              ]);
              for (let i = 0; i < shopifyGen.taskQty; i++) {
                saved.push({
                  id: uuidv4(),
                  module: "Shopify",
                  site: shopifyGen.site,
                  catchall: shopifyGen.catchall,
                  useProxies: shopifyGen.useProxies,
                });
              }
              await config.set("voro-cli.tasks", saved);
              break;
            case "Walmart":
              let walmartGen = await inquirer.prompt([
                {
                  type: "input",
                  name: "catchall",
                  message: "Catchall:",
                },
                {
                  type: "input",
                  name: "taskQty",
                  message: "How many tasks would you like to create?",
                },
                {
                  type: "confirm",
                  name: "useProxies",
                  message: "Use proxies?",
                },
              ]);
              for (let i = 0; i < walmartGen.taskQty; i++) {
                saved.push({
                  id: uuidv4(),
                  module: "Walmart",
                  catchall: walmartGen.catchall,
                  useProxies: walmartGen.useProxies,
                });
              }
              await config.set("voro-cli.tasks", saved);
              break;
            case "Target":
              let targetGen = await inquirer.prompt([
                {
                  type: "input",
                  name: "catchall",
                  message: "Catchall:",
                },
                {
                  type: "input",
                  name: "taskQty",
                  message: "How many tasks would you like to create?",
                },
                {
                  type: "confirm",
                  name: "useProxies",
                  message: "Use proxies?",
                },
              ]);
              for (let i = 0; i < targetGen.taskQty; i++) {
                saved.push({
                  id: uuidv4(),
                  module: "Target Gen",
                  catchall: targetGen.catchall,
                  useProxies: targetGen.useProxies,
                });
              }
              await config.set("voro-cli.tasks", saved);
              break;
            case "GMAIL":
              let smsRegions = [
                { id: "afghanistan", label: "Afghanistan" },
                { id: "albania", label: "Albania" },
                { id: "algeria", label: "Algeria" },
                { id: "angola", label: "Angola" },
                { id: "anguilla", label: "Anguilla" },
                { id: "antiguaandbarbuda", label: "Antigua and Barbuda" },
                { id: "argentina", label: "Argentina" },
                { id: "armenia", label: "Armenia" },
                { id: "aruba", label: "Aruba" },
                { id: "australia", label: "Australia" },
                { id: "austria", label: "Austria" },
                { id: "azerbaijan", label: "Azerbaijan" },
                { id: "bahamas", label: "Bahamas" },
                { id: "bahrain", label: "Bahrain" },
                { id: "bangladesh", label: "Bangladesh" },
                { id: "barbados", label: "Barbados" },
                { id: "belarus", label: "Belarus" },
                { id: "belgium", label: "Belgium" },
                { id: "belize", label: "Belize" },
                { id: "benin", label: "Benin" },
                { id: "bhutane", label: "Bhutan" },
                { id: "bih", label: "Bosnia and Herzegovina" },
                { id: "bolivia", label: "Bolivia" },
                { id: "botswana", label: "Botswana" },
                { id: "brazil", label: "Brazil" },
                { id: "bulgaria", label: "Bulgaria" },
                { id: "burkinafaso", label: "Burkina Faso" },
                { id: "burundi", label: "Burundi" },
                { id: "cambodia", label: "Cambodia" },
                { id: "cameroon", label: "Cameroon" },
                { id: "canada", label: "Canada" },
                { id: "capeverde", label: "Cape Verde" },
                { id: "caymanislands", label: "Cayman Islands" },
                { id: "chad", label: "Chad" },
                { id: "chile", label: "Chile" },
                { id: "china", label: "China" },
                { id: "colombia", label: "Colombia" },
                { id: "comoros", label: "Comoros" },
                { id: "congo", label: "Congo" },
                { id: "costarica", label: "Costa Rica" },
                { id: "croatia", label: "Croatia" },
                { id: "cyprus", label: "Cyprus" },
                { id: "czech", label: "Czechia" },
                { id: "djibouti", label: "Djibouti" },
                { id: "dominica", label: "Dominica" },
                { id: "dominicana", label: "Dominican Republic" },
                { id: "easttimor", label: "East Timor" },
                { id: "ecuador", label: "Ecuador" },
                { id: "egypt", label: "Egypt" },
                { id: "england", label: "England" },
                { id: "equatorialguinea", label: "Equatorial Guinea" },
                { id: "eritrea", label: "Eritrea" },
                { id: "estonia", label: "Estonia" },
                { id: "ethiopia", label: "Ethiopia" },
                { id: "finland", label: "Finland" },
                { id: "france", label: "France" },
                { id: "frenchguiana", label: "French Guiana" },
                { id: "gabon", label: "Gabon" },
                { id: "gambia", label: "Gambia" },
                { id: "georgia", label: "Georgia" },
                { id: "germany", label: "Germany" },
                { id: "ghana", label: "Ghana" },
                { id: "greece", label: "Greece" },
                { id: "grenada", label: "Grenada" },
                { id: "guadeloupe", label: "Guadeloupe" },
                { id: "guatemala", label: "Guatemala" },
                { id: "guinea", label: "Guinea" },
                { id: "guineabissau", label: "Guinea-Bissau" },
                { id: "guyana", label: "Guyana" },
                { id: "haiti", label: "Haiti" },
                { id: "honduras", label: "Honduras" },
                { id: "hongkong", label: "Hong Kong" },
                { id: "hungary", label: "Hungary" },
                { id: "india", label: "India" },
                { id: "indonesia", label: "Indonesia" },
                { id: "ireland", label: "Ireland" },
                { id: "israel", label: "Israel" },
                { id: "italy", label: "Italy" },
                { id: "ivorycoast", label: "Ivory Coast" },
                { id: "jamaica", label: "Jamaica" },
                { id: "japan", label: "Japan" },
                { id: "jordan", label: "Jordan" },
                { id: "kazakhstan", label: "Kazakhstan" },
                { id: "kenya", label: "Kenya" },
                { id: "kuwait", label: "Kuwait" },
                { id: "kyrgyzstan", label: "Kyrgyzstan" },
                { id: "laos", label: "Laos" },
                { id: "latvia", label: "Latvia" },
                { id: "lesotho", label: "Lesotho" },
                { id: "liberia", label: "Liberia" },
                { id: "lithuania", label: "Lithuania" },
                { id: "luxembourg", label: "Luxembourg" },
                { id: "macau", label: "Macau" },
                { id: "madagascar", label: "Madagascar" },
                { id: "malawi", label: "Malawi" },
                { id: "malaysia", label: "Malaysia" },
                { id: "maldives", label: "Maldives" },
                { id: "mauritania", label: "Mauritania" },
                { id: "mauritius", label: "Mauritius" },
                { id: "mexico", label: "Mexico" },
                { id: "moldova", label: "Moldova" },
                { id: "mongolia", label: "Mongolia" },
                { id: "montenegro", label: "Montenegro" },
                { id: "montserrat", label: "Montserrat" },
                { id: "morocco", label: "Morocco" },
                { id: "mozambique", label: "Mozambique" },
                { id: "myanmar", label: "Myanmar" },
                { id: "namibia", label: "Namibia" },
                { id: "nepal", label: "Nepal" },
                { id: "netherlands", label: "Netherlands" },
                { id: "newcaledonia", label: "New Caledonia" },
                { id: "newzealand", label: "New Zealand" },
                { id: "nicaragua", label: "Nicaragua" },
                { id: "niger", label: "Niger" },
                { id: "nigeria", label: "Nigeria" },
                { id: "northmacedonia", label: "North Macedonia" },
                { id: "norway", label: "Norway" },
                { id: "oman", label: "Oman" },
                { id: "pakistan", label: "Pakistan" },
                { id: "panama", label: "Panama" },
                { id: "papuanewguinea", label: "Papua New Guinea" },
                { id: "paraguay", label: "Paraguay" },
                { id: "peru", label: "Peru" },
                { id: "philippines", label: "Philippines" },
                { id: "poland", label: "Poland" },
                { id: "portugal", label: "Portugal" },
                { id: "puertorico", label: "Puerto Rico" },
                { id: "reunion", label: "Reunion" },
                { id: "romania", label: "Romania" },
                { id: "russia", label: "Russia" },
                { id: "rwanda", label: "Rwanda" },
                { id: "saintkittsandnevis", label: "Saint Kitts and Nevis" },
                { id: "saintlucia", label: "Saint Lucia" },
                {
                  id: "saintvincentandgrenadines",
                  label: "Saint Vincent and the Grenadines",
                },
                { id: "salvador", label: "El Salvador" },
                { id: "samoa", label: "Samoa" },
                { id: "saotomeandprincipe", label: "Sao Tome and Principe" },
                { id: "saudiarabia", label: "Saudi Arabia" },
                { id: "senegal", label: "Senegal" },
                { id: "serbia", label: "Serbia" },
                { id: "seychelles", label: "Republic of Seychelles" },
                { id: "sierraleone", label: "Sierra Leone" },
                { id: "singapore", label: "Singapore" },
                { id: "slovakia", label: "Slovakia" },
                { id: "slovenia", label: "Slovenia" },
                { id: "solomonislands", label: "Solomon Islands" },
                { id: "southafrica", label: "South Africa" },
                { id: "spain", label: "Spain" },
                { id: "srilanka", label: "Sri Lanka" },
                { id: "suriname", label: "Suriname" },
                { id: "swaziland", label: "Swaziland" },
                { id: "sweden", label: "Sweden" },
                { id: "switzerland", label: "Switzerland" },
                { id: "taiwan", label: "Taiwan" },
                { id: "tajikistan", label: "Tajikistan" },
                { id: "tanzania", label: "Tanzania" },
                { id: "thailand", label: "Thailand" },
                { id: "tit", label: "Trinidad and Tobago" },
                { id: "togo", label: "Togo" },
                { id: "tonga", label: "Tonga" },
                { id: "tunisia", label: "Tunisia" },
                { id: "turkey", label: "Turkey" },
                { id: "turkmenistan", label: "Turkmenistan" },
                { id: "turksandcaicos", label: "Turks and Caicos Islands" },
                { id: "uganda", label: "Uganda" },
                { id: "ukraine", label: "Ukraine" },
                { id: "uruguay", label: "Uruguay" },
                { id: "usa", label: "USA" },
                { id: "uzbekistan", label: "Uzbekistan" },
                { id: "venezuela", label: "Venezuela" },
                { id: "vietnam", label: "Vietnam" },
                { id: "virginislands", label: "British Virgin Islands" },
                { id: "zambia", label: "Zambia" },
                { id: "zimbabwe", label: "Zimbabwe" },
              ];
              let gmailGen = await inquirer.prompt([
                {
                  type: "list",
                  name: "smsProvider",
                  message: "SMS Provider:",
                  choices: ["5sim"],
                },
                {
                  type: "list",
                  name: "smsRegion",
                  message: "SMS Region:",
                  choices: smsRegions.map((x) => {
                    return { name: x.label, value: x.id };
                  }),
                },
                {
                  type: "input",
                  name: "taskQty",
                  message: "How many tasks would you like to create?",
                },
                {
                  type: "confirm",
                  name: "useProxies",
                  message: "Use proxies?",
                },
              ]);
              for (let i = 0; i < gmailGen.taskQty; i++) {
                saved.push({
                  id: uuidv4(),
                  module: "GMAIL",
                  smsRegion: gmailGen.smsRegion,
                  useProxies: gmailGen.useProxies,
                  smsProvider: gmailGen.smsProvider,
                });
              }
              await config.set("voro-cli.tasks", saved);
              break;
            case "eBay":
              if (savedImap.length === 0) {
                log("No IMAP saved.", "error");
              } else {
                let ebayGen = await inquirer.prompt([
                  {
                    type: "input",
                    name: "catchall",
                    message: "Catchall:",
                  },
                  {
                    type: "input",
                    name: "taskQty",
                    message: "How many tasks would you like to create?",
                  },
                  {
                    type: "list",
                    name: "imap",
                    message: "IMAP Account:",
                    choices: savedImap.map((x) => x.email),
                  },
                  {
                    type: "confirm",
                    name: "useProxies",
                    message: "Use proxies?",
                  },
                ]);
                for (let i = 0; i < ebayGen.taskQty; i++) {
                  saved.push({
                    id: uuidv4(),
                    module: "eBay Gen",
                    catchall: ebayGen.catchall,
                    imap: ebayGen.imap,
                    useProxies: ebayGen.useProxies,
                  });
                }
                await config.set("voro-cli.tasks", saved);
              }
              break;
            case "Twitter":
              if (savedImap.length === 0) {
                log("No IMAP saved.", "error");
              } else {
                let twitterGen = await inquirer.prompt([
                  {
                    type: "input",
                    name: "catchall",
                    message: "Catchall:",
                  },
                  {
                    type: "list",
                    name: "imap",
                    message: "IMAP Account:",
                    choices: savedImap.map((x) => x.email),
                  },
                  {
                    type: "list",
                    name: "captchaSolver",
                    message: "Captcha Solver:",
                    choices: ["2Captcha", "CapSolver", "CapMonster"],
                  },
                  {
                    type: "input",
                    name: "taskQty",
                    message: "How many tasks would you like to create?",
                  },
                  {
                    type: "confirm",
                    name: "useProxies",
                    message: "Use proxies?",
                  },
                ]);
                for (let i = 0; i < twitterGen.taskQty; i++) {
                  saved.push({
                    id: uuidv4(),
                    module: "Twitter",
                    imap: twitterGen.imap,
                    catchall: twitterGen.catchall,
                    captchaSolver: twitterGen.captchaSolver,
                    useProxies: twitterGen.useProxies,
                  });
                }
                await config.set("voro-cli.tasks", saved);
              }
              break;
            case "Outlook":
              let outlookGen = await inquirer.prompt([
                {
                  type: "list",
                  name: "captchaSolver",
                  message: "Captcha Solver:",
                  choices: ["2Captcha", "CapSolver", "CapMonster"],
                },
                {
                  type: "input",
                  name: "taskQty",
                  message: "How many tasks would you like to create?",
                },
                {
                  type: "confirm",
                  name: "useProxies",
                  message: "Use proxies?",
                },
              ]);
              for (let i = 0; i < outlookGen.taskQty; i++) {
                saved.push({
                  id: uuidv4(),
                  module: "Outlook",
                  captchaSolver: outlookGen.captchaSolver,
                  useProxies: outlookGen.useProxies,
                });
              }
              await config.set("voro-cli.tasks", saved);
              break;
          }
          break;
        case "Food Deals":
          let foodGenTask = await inquirer.prompt([
            {
              type: "list",
              name: "action",
              message: "Select Deal:",
              choices: ["Krispy Kreme", "California Pizza Kitchen"],
            },
          ]);
          switch (foodGenTask.action) {
            case "California Pizza Kitchen":
              let cpkTask = await inquirer.prompt([
                {
                  type: "input",
                  name: "catchall",
                  message: "Catchall:",
                },
                {
                  type: "confirm",
                  name: "useProxies",
                  message: "Use proxies?",
                },
                {
                  type: "input",
                  name: "taskQty",
                  message: "How many tasks would you like to create?",
                },
              ]);
              for (let i = 0; i < cpkTask.taskQty; i++) {
                let newTask = {
                  id: uuidv4(),
                  catchall: cpkTask.catchall,
                  module: "California Pizza Kitchen",
                  useProxies: cpkTask.useProxies,
                };
                saved.push(newTask);
              }
              await config.set("voro-cli.tasks", saved);
              break;
            case "Krispy Kreme":
              let kkTask = await inquirer.prompt([
                {
                  type: "input",
                  name: "catchall",
                  message: "Catchall:",
                },
                {
                  type: "confirm",
                  name: "useProxies",
                  message: "Use proxies?",
                },
                {
                  type: "list",
                  name: "captchaSolver",
                  message: "Select captcha solver:",
                  choices: ["2Captcha", "CapSolver", "CapMonster"],
                },
                {
                  type: "input",
                  name: "taskQty",
                  message: "How many tasks would you like to create?",
                },
              ]);
              for (let i = 0; i < kkTask.taskQty; i++) {
                let newTask = {
                  id: uuidv4(),
                  catchall: kkTask.catchall,
                  module: "Krispy Kreme",
                  useProxies: kkTask.useProxies,
                  captchaSolver: kkTask.captchaSolver,
                };
                saved.push(newTask);
              }

              await config.set("voro-cli.tasks", saved);
              break;
          }
          break;
      }
      log("Tasks created successfully.", "success");
      await sleep(2500);
      await global.run();
      break;
    case "View All":
      if (saved.length > 0) {
        log(`Total tasks saved: ${saved.length}`, "warn");
        let outlookTasks = saved.filter((x) => x.module === "Outlook");
        let walmartTasks = saved.filter((x) => x.module === "Walmart");
        let targetGenTasks = saved.filter((x) => x.module === "Target Gen");
        let shopifyTasks = saved.filter((x) => x.module === "Shopify");
        let ebayGenTasks = saved.filter((x) => x.module === "eBay Gen");
        let twitterTasks = saved.filter((x) => x.module === "Twitter");
        let gmailTasks = saved.filter((x) => x.module === "GMAIL");
        let cpkTasks = saved.filter(
          (x) => x.module === "California Pizza Kitchen"
        );
        let kkTasks = saved.filter((x) => x.module === "Krispy Kreme");
        if (targetGenTasks.length > 0) {
          log(
            `---- Target Account Generator Tasks (${targetGenTasks.length}) ----`,
            "info"
          );
          console.table(targetGenTasks, ["module", "catchall", "useProxies"]);
        }
        if (cpkTasks.length > 0) {
          log(
            `---- California Pizza Kitchen Tasks (${cpkTasks.length}) ----`,
            "info"
          );
          console.table(cpkTasks, ["module", "catchall", "useProxies"]);
        }
        if (kkTasks.length > 0) {
          log(`---- Krispy Kreme Tasks (${kkTasks.length}) ----`, "info");
          console.table(kkTasks, [
            "module",
            "catchall",
            "captchaSolver",
            "useProxies",
          ]);
        }
        if (outlookTasks.length > 0) {
          log(`---- Outlook Tasks (${outlookTasks.length}) ----`, "info");
          console.table(outlookTasks, [
            "module",
            "captchaSolver",
            "useProxies",
          ]);
        }
        if (walmartTasks.length > 0) {
          log(`---- Walmart Tasks (${walmartTasks.length}) ----`, "info");
          console.table(walmartTasks, ["module", "catchall", "useProxies"]);
        }
        if (shopifyTasks.length > 0) {
          log(`---- Shopify Tasks (${shopifyTasks.length}) ----`, "info");
          console.table(shopifyTasks, [
            "module",
            "site",
            "catchall",
            "useProxies",
          ]);
        }
        if (ebayGenTasks.length > 0) {
          log(
            `---- eBay Account Generator Tasks (${ebayGenTasks.length}) ----`,
            "info"
          );
          console.table(ebayGenTasks, [
            "module",
            "catchall",
            "imap",
            "useProxies",
          ]);
        }
        if (twitterTasks.length > 0) {
          log(
            `---- Twitter Account Generator Tasks (${twitterTasks.length}) ----`,
            "info"
          );
          console.table(twitterTasks, [
            "module",
            "catchall",
            "imap",
            "captchaSolver",
            "useProxies",
          ]);
        }
        if (gmailTasks.length > 0) {
          log(
            `---- GMAIL Account Generator Tasks (${gmailTasks.length}) ----`,
            "info"
          );
          console.table(gmailTasks, [
            "module",
            "smsProvider",
            "smsRegion",
            "useProxies",
          ]);
        }
      } else {
        log("No tasks saved", "error");
      }
      await sleep(2500);
      await global.run();
      break;
    case "Clear All":
      log("Clearing all tasks...", "info");
      saved = [];
      config.set("voro-cli.tasks", saved);
      log("Cleared all tasks", "success");
      await sleep(2500);
      await global.run();
      break;
  }
};

module.exports = {
  handleTasksManager,
};
