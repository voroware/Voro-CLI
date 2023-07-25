const got = require("got");
const cheerio = require("cheerio");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { log, getRandomProxy } = require("../../utils.js");

const getItemInfo = async (body) => {
  let itemIdMatch = body.match(/content="ouapp:\/\/\/item\/detail\/(\d+)"/);
  let itemId = itemIdMatch ? itemIdMatch[1] : null;
  let listingIdMatch = body.match(/"listingId":"(.*?)"/);
  let listingId = listingIdMatch ? listingIdMatch[1] : null;
  let sellerIdMatch = body.match(/,"ownerId":"(\d+)"/);
  let sellerId = sellerIdMatch ? sellerIdMatch[1] : null;
  return {
    itemId,
    listingId,
    sellerId,
  };
};

const sendOfferUpViews = async (url, sendQty, useProxies, autoBoost) => {
  try {
    let config = {
      method: "GET",
      url,
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
    if (useProxies) {
      config.agent = {
        https: new HttpsProxyAgent(await getRandomProxy()),
      };
    }
    let response = await got(config);
    let $ = cheerio.load(response.body);
    let { itemId, listingId, sellerId } = await getItemInfo(response.body);
    log(`[OfferUp Views] ---> Sending ${sendQty} views to [ ${url} ]`, "info");
    const sendViewPromises = Array.from({ length: sendQty }, (_, i) =>
      sendView(itemId, listingId, sellerId, url, useProxies)
    );
    await Promise.all(sendViewPromises);
  } catch (e) {
    log(e.message, "error");
  } finally {
    if (autoBoost === true) {
      log(
        `[OfferUp Views] ---> Auto boosting ${url} every 5 minutes...`,
        "warn"
      );
      setTimeout(
        () => sendOfferUpViews(url, sendQty, useProxies, autoBoost),
        300000
      );
    }
  }
};

const sendView = async (itemId, listingId, sellerId, url, useProxies) => {
  let config = {
    method: "POST",
    url: "https://offerup.com/api/graphql",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "content-type": "application/json",
      "ou-browser-user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
      Origin: "https://offerup.com",
      Referer: url,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
    },
    json: {
      operationName: "TrackItemViewed",
      variables: {
        itemId: itemId,
        listingId: listingId,
        sellerId: sellerId,
        header: {
          appVersion: "",
          deviceId: "None",
          origin: "web_desktop",
          timestamp: "None",
          uniqueId: "None",
        },
        mobileHeader: { localTimestamp: "None" },
        shipping: { available: false },
        posting: {
          itemTitle: "None",
          itemPrice: 10900,
          itemCondition: 40,
          itemLocation: {
            latitude: 41.6750889,
            longitude: -72.92243289999999,
          },
          postingTimestamp: "None",
        },
        vehicle: {
          make: null,
          mileage: null,
          model: null,
          year: null,
        },
        tileLocation: null,
        categoryId: "14",
        sellerType: "PRIVATE_PARTY",
        moduleRank: null,
      },
      query:
        "mutation TrackItemViewed($itemId: ID!, $listingId: ID!, $sellerId: ID!, $header: ItemViewedEventHeader!, $mobileHeader: ItemViewedEventMobileHeader!, $origin: String, $source: String, $tileType: String, $userId: String, $moduleId: ID, $shipping: ShippingInput, $vehicle: VehicleInput, $posting: PostingInput, $tileLocation: Int, $categoryId: String, $moduleType: String, $sellerType: SellerType, $moduleRank: Int) {\n  itemViewed(\n    data: {itemId: $itemId, listingId: $listingId, sellerId: $sellerId, origin: $origin, source: $source, tileType: $tileType, userId: $userId, header: $header, mobileHeader: $mobileHeader, moduleId: $moduleId, shipping: $shipping, vehicle: $vehicle, posting: $posting, tileLocation: $tileLocation, categoryId: $categoryId, moduleType: $moduleType, sellerType: $sellerType, moduleRank: $moduleRank}\n  )\n}\n",
    },
    responseType: "json",
  };

  if (useProxies) {
    config.agent = {
      https: new HttpsProxyAgent(await getRandomProxy()),
    };
  }

  await got(config);
};

module.exports = {
  sendOfferUpViews,
};
