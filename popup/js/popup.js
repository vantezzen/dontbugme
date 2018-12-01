/**
 * DontBugMe Browser Extension.
 * Easily insert credentials from BugMeNot.com into any page.
 * This extension is not affiliated to BugMeNot.com in any way.
 * 
 * @copyright   Copyright vantezzen (https://github.com/vantezzen)
 * @link        https://github.com/vantezzen/dontbugme
 * @license     https://opensource.org/licenses/mit-license.php MIT License
 */

// Domain of the current tab
let domain;

// Current tab instance
let tab;

// If autosubmit is enabled, check the checkbox
if (localStorage.getItem('autosubmit') == 'yes') {
    $('#autosubmit').prop('checked', true);
}

// Update localStorage variable when autosubmit checkbox gets clicked
$('#autosubmit').click(function() {
    if ($('#autosubmit').prop('checked')) {
        localStorage.setItem('autosubmit', 'yes');
    } else {
        localStorage.setItem('autosubmit', 'no');
    }
});

// Get the domain of the current tab
function getTabDomain(tabs) {
    tab = tabs[0];

    // Get the full domain name (e.g. sub.domain.example.com)
    let fullUrl = tab.url.match(/:\/\/(.[^/]+)/)[1];

    // Get the main domain (e.g. example.com)
    let split = fullUrl.split('.');
    domain = split[split.length - 2] + '.' + split[split.length - 1];

    console.debug("Current domain is " + domain);

    // Get logins for the current domain
    getLogins();
}

// Log errors to the console
function onError(err){
    console.error(err);
}

// Query for current open tab
chrome.tabs.query({currentWindow: true, active: true}, getTabDomain);

// Get logins for current tab
function getLogins() {
    // Reset logins list on page
    $('.logins').text('Searching for logins...');

    // Make GET request to bugmenot.com for current domain
    jQuery.get('http://bugmenot.com/view/' + domain).done(function(data) {
        // Turn response into jQuery object
        let page = $(data).find('#content');

        // Check if there are accounts
        if (page.find('.account').length == 0) {
            $('.logins').html('It looks like there are no availible logins for this page.');
        } else {
            // Clear logins list
            $('.logins').html('');
        }

        // Loop through accounts on bugmenot page
        page.find('.account').each(function(el) {
            // Get username and password from page
            let user = $(this).find('kbd').first().text();
            let pass = $(this).find('kbd').eq(1).text();

            // Create new element for logins list
            let element = $(`
                <li class="list-group-item login">
                    Username: ` + user + `<br />
                    Password: ` + pass + `
                </li>
            `);

            // Add click listener to element
            element.click(function() {
                // Insert username and password into tab
                // Try to find username input
                executeInTab("document.querySelector('input[name=email]').value = '" + user + "';");
                executeInTab("document.querySelector('input[name=mail]').value = '" + user + "';");
                executeInTab("document.querySelector('input[name=user]').value = '" + user + "';");
                executeInTab("document.querySelector('input[name=username]').value = '" + user + "';");
                executeInTab("document.querySelector('input[id=email]').value = '" + user + "';");
                executeInTab("document.querySelector('input[id=mail]').value = '" + user + "';");
                executeInTab("document.querySelector('input[id=user]').value = '" + user + "';");
                executeInTab("document.querySelector('input[id=username]').value = '" + user + "';");
                executeInTab("document.querySelector('input[type=text]').value = '" + user + "';");

                executeInTab("document.querySelector('input[type=password]').value = '" + pass + "';");

                // Submit if autosubmit is on
                if ($('#autosubmit').prop('checked')) {
                    // Get form of username box and submit it
                    executeInTab("document.querySelector('input[type=password]').form.submit()");

                    // Close window as saved page is invalid from now
                    window.close();
                }
            });

            // Append new element to logins list
            $('.logins').append(element);

            // Log username and password for debugging purposes
            console.log(user, pass);
        });
    }).fail(function(error) {
        console.log(error);
    });
}

// Execute JavaScript code in current open tab
function executeInTab(code) {
    chrome.tabs.executeScript({
        code
    });
}