/**
 * DontBugMe Browser Extension.
 * Easily insert credentials from BugMeNot.com into any page.
 * This extension is not affiliated to BugMeNot.com in any way.
 * 
 * @copyright   Copyright vantezzen (https://github.com/vantezzen)
 * @link        https://github.com/vantezzen/dontbugme
 * @license     https://opensource.org/licenses/mit-license.php MIT License
 */
let currentTab;

// Handle i18n strings in page
const elementsWithI18n = document.querySelectorAll('[data-i18n]');

for (const element of elementsWithI18n) {
    const string = element.dataset['i18n'];
    const translation = chrome.i18n.getMessage(string);

    element.innerText = translation;
}

// If autosubmit is enabled, check the checkbox
if (localStorage.getItem('autosubmit') == 'yes') {
    document.getElementById('autosubmit').checked = true;
}

// Update localStorage variable when autosubmit checkbox gets clicked
document.getElementById('autosubmit').addEventListener('click', () => {
    if (document.getElementById('autosubmit').checked) {
        localStorage.setItem('autosubmit', 'yes');
    } else {
        localStorage.setItem('autosubmit', 'no');
    }
});

// Restore current choice of checking availible accounts
chrome.storage.local.get(['badge'], result => {
    if (result.badge === true) {
        document.getElementById('badge').checked = true;
    }
});
// Update storage on setting change
document.getElementById('badge').addEventListener('click', () => {
    chrome.storage.local.set({
        badge: document.getElementById('badge').checked
    });
});

// Query for current open tab
chrome.tabs.query({currentWindow: true, active: true}, tabs => {
    // Get domain of current tab
    const domain = getUrlDomain(tabs[0].url);

    currentTab = tabs[0];

    // Get logins for the current domain
    getLogins(domain);
});

// Show a random message in the info field
const infos = [
    'Help us translate DontBugMe into your language by <a href="#" data-to="https://github.com/vantezzen/dontbugme/issues/new?assignees=&labels=&template=provide-translation.md&title=%5BTranslation%5D+LANGUAGE">providing us your translations.</a>',
    'Do you like DontBugMe? Please recommend it to your friends!',
    'If you like DontBugMe, please consider <a href="#" data-to="https://dontbugme.vantezzen.io/rate.html">rating us in the extension store</a>.'
]
document.getElementById('info').innerHTML = infos[Math.floor(Math.random() * infos.length)];

// Listen for clicks on the "Open BugMeNot page for current domain" button
document.getElementById('openBugmenot').addEventListener('click', () => {
    // Get domain of current tab
    const domain = getUrlDomain(currentTab.url);

    // Get domain to BugMeNot
    const url = 'http://bugmenot.com/view/' + domain;

    // Open new tab
    const win = window.open(url, '_blank');
    win.focus();
})

// Make link in info text work
const linkInInfo = document.getElementById('info').querySelector('a');
if (linkInInfo) {
    linkInInfo.addEventListener('click', evt => {
        const link = evt.target.dataset.to;

        const win = window.open(link, '_blank');
        win.focus();
    })
}

// Get logins for current tab
const getLogins = (domain) => {
    // Reset logins list on page
    document.getElementById('logins').innerText = 'Searching...';

    // Make GET request to bugmenot.com for current domain
    fetch('http://bugmenot.com/view/' + domain)
    .then(data => data.text())
    .then(data => {
        // Turn response into html element
        let page = document.createElement('div');
        page.innerHTML = data;
        page = page.querySelector('#content');

        // Check if there are accounts
        if (page.getElementsByClassName('account').length == 0) {
            document.getElementById('logins').innerText = chrome.i18n.getMessage('popupNoAccounts');
        } else {
            // Clear logins list
            document.getElementById('logins').innerHTML = '';
        }

        // Loop through accounts on bugmenot page
        const elements = page.getElementsByClassName('account')
        
        for (const el of elements) {
            // Get username and password from page
            const kbd = el.querySelectorAll('kbd');
            const user = kbd[0].innerText;
            const pass = kbd[1].innerText;
            const other = (typeof kbd[2] !== 'undefined' ? kbd[2].innerText : '');

            // If BugMeNot provides an "Other" field, display it
            var otherElement = "";
            if (other.length) {
            	var otherElement = `<br /><kbd>${other}</kbd>`;
            }

            // Get success rate
            const successString = el.querySelector('.success_rate').innerText;
            const success = /\d{1,3}/.exec(successString)[0];
            const successColor = window.getColor(success);

            // Create new element for logins list
            let element = document.createElement('li');
            element.classList.add('list-group-item', 'login')
            element.innerHTML = `
                <div class="row">
                    <div class="col-1 pr-0 success-container">
                        <div class="success-circle" style="background-color: ${successColor};"></div>
                    </div>
                    <div class="col-10 login-container">
                        <kbd>${user}</kbd><br />
                        <kbd>${pass}</kbd>
                        ${otherElement}
                    </div>
                </div>
            `;

            // Add click listener to element
            element.addEventListener('click', () => {
                // Set timeout if no content script availible
                const noConnectionTimeout = setTimeout(() => {
                    // Show alert
                    document.getElementById('could-not-connect').style.display = 'block';
                }, 100);

                // Send credentials to content script to autofill
                chrome.tabs.sendMessage(currentTab.id, {
                    command: 'fill',
                    user,
                    password: pass,
                    other: other,
                    autosubmit: localStorage.getItem('autosubmit') == 'yes'
                }, response => {
                    // Check if chrome threw connection error
                    const error = chrome.runtime.lastError;

                    if (!error || error.message !== 'Could not establish connection. Receiving end does not exist.') {
                        // Connection confirmed - clear no connection timeout
                        clearTimeout(noConnectionTimeout);
                    }
                    
                });
                
                
                if (localStorage.getItem('autosubmit') == 'yes') {
                    // Close window if autosubmitting
                    window.close();
                }
            });

            // Append new element to logins list
            document.getElementById('logins').append(element);
        }
    }).catch(console.error);
}