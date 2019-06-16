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
  // Get the full domain name (e.g. sub.domain.example.com)
  let fullUrl = url.match(/:\/\/(.[^/]+)/)[1];

  // Get the main domain (e.g. example.com)
  let split = fullUrl.split('.');
  return split[split.length - 2] + '.' + split[split.length - 1];
}