const got = require("got");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { log, getRandomProxy } = require("../../utils.js");

const sendViews = async (ebayUrl, useProxies, sendQty, autoBoost) => {
  try{
    log(
      `[eBay Views] ---> Sending ${sendQty} views...`,
      "info"
    );
  
    const sendPromises = Array.from({ length: sendQty }, () => send(ebayUrl, useProxies));
    await Promise.all(sendPromises);
  
    log(
      `[eBay Views] ---> ${sendQty} views sent to ${ebayUrl}`,
      "success"
    );
  } catch(e){
    log(e.message, 'error')
  } finally {
    if (autoBoost && autoBoost === true) {
      log(
        `[eBay Views] ---> Auto boosting ${ebayUrl} every 5 minutes...`,
        "warn"
      );
      setTimeout(() => sendViews(ebayUrl, useProxies, sendQty, autoBoost), 300000);
    }
  }
};

const send = async (url, useProxies) => {
  let config = {
    method: "GET",
    url: url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: "https://www.ebay.com/",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      TE: "trailers",
    },
  };
  if(useProxies){
    config.agent = {
      https: new HttpsProxyAgent((await getRandomProxy()))
    }
  }
  await got(config);
};

module.exports = {
  sendViews,
};
