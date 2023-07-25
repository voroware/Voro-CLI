const { chromium, firefox } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth");
const LocateChrome = require("locate-chrome");
const url = require("url");
chromium.use(stealth());
const { log, getRandomProxy } = require("../../utils.js");

module.exports = class SpoofBrowser {
  constructor(browser, url, useProxies, id) {
    this.id = id;
    this.browserType = browser;
    this.url = url;
    this.useProxies = useProxies;
  }

  async launch() {
    this.log(`Launching ${this.browserType}...`, "info");
    let browserConfig = {
      headless: false,
      ignoreHTTPSErrors: true,
      defaultViewport: { width: 1366, height: 768 },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    }

    if(this.useProxies){
      let proxyString = await getRandomProxy();
      let parsedProxyUrl = url.parse(proxyString);
      browserConfig.proxy = {
        server: parsedProxyUrl.hostname + ':' + parsedProxyUrl.port,
        username: parsedProxyUrl.username,
        password: parsedProxyUrl.password
      }
    }
    switch (this.browserType) {
      case "Chrome":
        browserConfig.executablePath = await LocateChrome();
        this.browser = await chromium.launch(browserConfig);
        break;
      default:
        this.browser = await firefox.launch(browserConfig);
        break;
    }
    this.log(`${this.browserType} is open!`, "success");
    let page = await this.browser.newPage({
      colorScheme: "dark",
      javaScriptEnabled: true,
    });
    await page.goto(this.url);
  }

  log(message, type) {
    log(`[Spoof Browser] --- ${this.url} ---> ${message}`, type);
  }
};
