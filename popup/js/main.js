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

// Get the domain of the current tab
const getTabDomain = (tab) => {
    // Get the full domain name (e.g. sub.domain.example.com)
    let fullUrl = tab.url.match(/:\/\/(.[^/]+)/)[1];

    // Get the main domain (e.g. example.com)
    let split = fullUrl.split('.');
    return split[split.length - 2] + '.' + split[split.length - 1];
}

// Query for current open tab
chrome.tabs.query({currentWindow: true, active: true}, tabs => {
    // Get domain of current tab
    const domain = getTabDomain(tabs[0]);

    currentTab = tabs[0];

    // Get logins for the current domain
    getLogins(domain);
});

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
            document.getElementById('logins').innerText = 'It looks like there are no availible logins for this page.';
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
                    </div>
                </div>
            `;

            // Add click listener to element
            element.addEventListener('click', () => {
                // Send credentials to content script to autofill
                chrome.tabs.sendMessage(currentTab.id, {
                    command: 'fill',
                    user,
                    password: pass,
                    autosubmit: localStorage.getItem('autosubmit') == 'yes'
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

// Execute JavaScript code in current open tab
function executeInTab(code) {
    chrome.tabs.executeScript({
        code
    });
}