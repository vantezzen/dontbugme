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

// Update badge when changing tab or page
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // Only update on loading
  if (changeInfo === 'loading') {
    updateAvailibleCredentials(tab.url);
  }
});
chrome.tabs.onActiveChanged.addListener(function(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    updateAvailibleCredentials(tab.url);
  })
});

const updateAvailibleCredentials = (url) => {
  // Dont get info on internal pages
  if (/(chrome|about):\/\/.*/.test(url)) {
    chrome.browserAction.setBadgeText({
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
        chrome.browserAction.setBadgeText({
          text: accountsForDomain[domain] === 0 ? '' : String(accountsForDomain[domain])
        })
        return;
      }

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
          chrome.browserAction.setBadgeText({
            text: accounts === 0 ? '' : String(accounts)
          })
        });
    }
  });
}
