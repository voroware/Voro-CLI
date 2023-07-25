// Importing required modules
const CryptoJS = require("crypto-js");
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const fs = require("fs").promises;
const path = require("path");
const { version } = require("../package.json");
const gradient = require("gradient-string");
const clc = require("cli-color");
const Conf = require("conf");
const config = new Conf("voro-cli");

const defaultConfig = {
  licenseKey: "",
  tasks: [],
  webhooks: [],
  imap: [],
  proxies: [],
  sms: {
    fivesim: "",
    smsactivate: "",
  },
  captcha: {
    twocaptcha: "",
    capmonster: "",
    capsolver: "",
  },
};

const log = (message, type) => {
  switch (type) {
    case "error":
      console.log(clc.redBright(message));
      break;
    case "success":
      console.log(clc.greenBright(message));
      break;
    case "warn":
      console.log(clc.yellowBright(message));
      break;
    case "info":
      console.log(clc.cyanBright(message));
      break;
  }
};

const fetchSavedConfig = async () => {
  return await config.get("voro-cli");
};

const encrypt = (content, password) => {
  return CryptoJS.AES.encrypt(JSON.stringify({ content }), password).toString();
};

const decrypt = (crypted, password) => {
  return JSON.parse(
    CryptoJS.AES.decrypt(crypted, password).toString(CryptoJS.enc.Utf8)
  ).content;
};

const logLogo = () => {
  console.log(
    gradient.summer(`
    ██    ██  ██████  ██████   ██████       ██████ ██      ██ 
    ██    ██ ██    ██ ██   ██ ██    ██     ██      ██      ██ 
    ██    ██ ██    ██ ██████  ██    ██     ██      ██      ██ 
     ██  ██  ██    ██ ██   ██ ██    ██     ██      ██      ██ 
      ████    ██████  ██   ██  ██████       ██████ ███████ ██
      
                Made by @paymentlogs (v${version})`)
  );
};

const testWebhook = async (hookURL) => {
  const hook = new Webhook(hookURL);

  const embed = new MessageBuilder()
    .setTitle("This is a test Webhook")
    .setAuthor(
      "Voro CLI",
      "https://pbs.twimg.com/media/Du3-pMBUwAArtpV?format=jpg&name=small",
      "https://github.com/paymentlogs"
    )
    .setURL("https://github.com/paymentlogs")
    .setColor("#000000")
    .setDescription("Your webhook is working!")
    .setFooter(
      "Voro CLI - @paymentlogs",
      "https://pbs.twimg.com/media/Du3-pMBUwAArtpV?format=jpg&name=small"
    )
    .setTimestamp();
  hook.setAvatar(
    "https://media.discordapp.net/attachments/1129874829756084265/1129893421335715840/IMG_7390.jpg?width=800&height=518"
  );
  hook.setUsername("VoroCLI");
  await hook.send(embed);
};

const sendWebhook = async (obj) => {
  const hook = new Webhook(obj.hookURL);

  const embed = new MessageBuilder();
  if (obj.title) {
    embed.setTitle(obj.title);
  }
  if (obj.description) {
    embed.setDescription(obj.description);
  }
  if (obj.fields) {
    for (let field of obj.fields) {
      embed.addField(field.name, field.value, field.inline);
    }
  }
  embed.setAuthor(
    "VoroCLI",
    "https://pbs.twimg.com/media/Du3-pMBUwAArtpV?format=jpg&name=small"
  );
  if (obj.url) {
    embed.setURL(obj.url);
  }
  embed.setColor("#000000");
  embed.setFooter(
    "VoroCLI - @paymentlogs",
    "https://pbs.twimg.com/media/Du3-pMBUwAArtpV?format=jpg&name=small"
  );
  if (obj.thumbnail) {
    embed.setThumbnail(obj.thumbnail);
  }
  if (obj.image) {
    embed.setImage(obj.image);
  }
  embed.setTimestamp();
  hook.setAvatar(
    "https://media.discordapp.net/attachments/1129874829756084265/1129893421335715840/IMG_7390.jpg?width=800&height=518"
  );
  hook.setUsername("VoroCLI");
  await hook.send(embed);
};

const getProxyFile = async () => {
  let p = path.join(process.cwd(), "proxies.txt");
  let contents = await fs.readFile(p, "utf8");
  if (contents.includes("ip:port:username:password")) {
    return null;
  } else {
    return contents;
  }
};

const parseProxyString = (proxy) => {
  const [ip, port, username, password] = proxy.split(":");
  if (username && password) {
    return `http://${username}:${password}@${ip}:${port}`.replace(
      /[\r\n]/g,
      ""
    );
  } else {
    return `http://${ip}:${port}`.replace(/[\r\n]/g, "");
  }
};

const getRandomProxy = async () => {
  let list = (await getProxyFile()).split("\n");
  let proxy = list[Math.floor(Math.random() * list.length)];
  let formatted = parseProxyString(proxy);
  return formatted;
};

const checkFileExists = async (path) => {
  try {
    await fs.readFile(path, "utf8");
    return true;
  } catch (e) {
    return false;
  }
};

const sleep = (ms) => {
  return new Promise((r) => setTimeout(r, ms));
};

module.exports = {
  encrypt,
  decrypt,
  defaultConfig,
  logLogo,
  testWebhook,
  sendWebhook,
  getProxyFile,
  getRandomProxy,
  checkFileExists,
  parseProxyString,
  sleep,
  fetchSavedConfig,
  config,
  log,
};
