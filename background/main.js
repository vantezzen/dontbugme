/**
 * DontBugMe Browser Extension.
 * Background script that checks how many credentials are availible for the current website
 * 
 * @copyright   Copyright vantezzen (https://github.com/vantezzen)
 * @link        https://github.com/vantezzen/dontbugme
 * @license     https://opensource.org/licenses/mit-license.php MIT License
 */
// Cache for number of accounts
let accountsForDomain = {};

const isChrome = !window.hasOwnProperty('browser');
const platform = isChrome ? chrome : browser;

// Update badge when changing tab or page
platform.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only update on loading
  console.log(changeInfo);
  if (changeInfo.status === 'loading') {
    updateAvailibleCredentials(tab.url);
  }
});

if (isChrome) {
  chrome.tabs.onActiveChanged.addListener(tabId => {
    chrome.tabs.get(tabId, (tab) => {
      updateAvailibleCredentials(tab.url);
    })
  });
} else {
  browser.tabs.onActivated.addListener(activeInfo => {
    browser.tabs.get(activeInfo.tabId)
    .then(tab => {
      updateAvailibleCredentials(tab.url);
    });
  })
}


const updateAvailibleCredentials = (url) => {
  // Dont get info on internal pages
  if (/(chrome|about):\/\/.*/.test(url) || /about:.*/.test(url)) {
    platform.browserAction.setBadgeText({
      text: ''
    })
    return;
  }

  // Dont get info when badge is disabled
  chrome.storage.local.get(["badge"], result => {
    if (result.badge !== false) {
      const domain = getUrlDomain(url);

      // Use cached value if availible
      if (accountsForDomain[domain]) {
        platform.browserAction.setBadgeText({
          text: accountsForDomain[domain] === 0 ? '' : String(accountsForDomain[domain])
        })
        return;
      }

      // Needing to get information from BugMeNot - clear temporarily
      platform.browserAction.setBadgeText({
        text: ''
      })

      // Get number of accounts from BugMeNot
      fetch('http://bugmenot.com/view/' + domain)
        .then(data => data.text())
        .then(data => {
          // Turn response into html element
          let page = document.createElement('div');
          page.innerHTML = data;
          page = page.querySelector('#content');

          // Count number of accounts
          const accounts = page.getElementsByClassName('account').length;

          // Cache result and set badge
          accountsForDomain[domain] = accounts;
          platform.browserAction.setBadgeText({
            text: accounts === 0 ? '' : String(accounts)
          })
        });
    }
  });
}
