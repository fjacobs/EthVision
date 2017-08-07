/**
 * Declare initial variables
 */
const xhr = new XMLHttpRequest();
let amt = 0;

/**
 * All data about ETH price comes from Coinbase API.
 */
const COINBASE_ETH_PRICE_URL = "https://api.coinbase.com/v2/prices/ETH-USD/spot"
const BITTREX_NEO_PRICE_URL = "https://bittrex.com/api/v1.1/public/getticker?market=USDT-NEO"

/**
 * setBadge
 * --------
 * Sets badge with the current price of ETH.
 */
const setBadge = (amt) => {
  chrome.browserAction.setBadgeText({
    text: amt.split('.')[0]
  })
};

/**
 * sendPriceMsg
 * -------------
 * Sends a message from background.js to a listener in popup.js with the current ETH price.
 */
const sendPriceMsg = (amt) => {
  chrome.runtime.sendMessage({
    action: 'send',
    msg: amt
  });
};


/**
 * fetchNeoPrice
 * ----------
 * Fetches current ETH price from Coinbase API.
 * Sets badge number to price of ETH.
 * Sends price data to popup.js to display in the extension popup.
 */
const fetchNeoPrice = () => {
  xhr.open("GET", BITTREX_NEO_PRICE_URL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const resp = JSON.parse(xhr.responseText);
      const { result: { last } } = resp;
      amt = last;
      setBadge(last);
      sendPriceMsg(last);
    }
  }
  xhr.send();
};

/**
 * fetchEthPrice
 * ----------
 * Fetches current ETH price from Coinbase API.
 * Sets badge number to price of ETH.
 * Sends price data to popup.js to display in the extension popup.
 */
const fetchEthPrice = () => {
  xhr.open("GET", COINBASE_ETH_PRICE_URL, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const resp = JSON.parse(xhr.responseText);
      const { data: { amount } } = resp;
      amt = amount;
      setBadge(amount);
      sendPriceMsg(amount);
    }
  }
  xhr.send();
};

/**
 * fetch listener
 * --------------
 * Adds listener for price fetch requests from popup.js.
 */
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if (msg.action === 'fetch') {
    response(amt);
  }
});

/**
 * Init
 */
fetchNeoPrice();

/**
 * Poll for prices every 5 seconds.
 */
setInterval(fetchNeoPrice, 20000);
