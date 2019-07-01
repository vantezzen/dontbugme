/**
 * DontBugMe Browser Extension.
 * Shared JavaScript functions used by popup and background script
 * 
 * @copyright   Copyright vantezzen (https://github.com/vantezzen)
 * @link        https://github.com/vantezzen/dontbugme
 * @license     https://opensource.org/licenses/mit-license.php MIT License
 */

 // Get the domain of the current tab
const getUrlDomain = (url) => {
  const host = (new URL(url)).host;
  const tld = host.split(/\./).slice(-2).join('.');

  return tld;
}