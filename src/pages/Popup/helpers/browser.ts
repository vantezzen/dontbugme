import { browser } from "webextension-polyfill-ts";

/**
 * Get the domain name of the current tab page.
 * Will return "false" if the domain cannot be get
 */
export const getCurrentDomain = async () : Promise<string | false> => {
  const tabs = await browser.tabs.query({currentWindow: true, active: true});
  if (tabs.length === 0) return false;
  const tab = tabs[0];
  if (!tab.url) return false;

  const fullDomain = new URL(tab.url).hostname;

  return fullDomain.replace(/^www\./, '');
}

/**
 * Get all possible parent domains of the current domain.
 * E.g. if the complete domain is "a.b.c.example.com", the parent domains are:
 * - "a.b.c.example.com"
 * - "b.c.example.com"
 * - "c.example.com"
 * - "example.com"
 * 
 * @param {string} domain - The domain to get the parent domains for.
 * @returns {string[]} The parent domains.
 */
export const getPossibleDomains = (domain : string) : string[] => {
  const parts = domain.split(".");
  const domains = [];
  for (let i = 0; i < parts.length - 1; i++) {
    domains.push(parts.slice(i).join("."));
  }
  return domains;
};

export const sendMessageToCurrentTab = async (message : object) => {
  console.log('Send message to current tab: ', message);
  const tabs = await browser.tabs.query({currentWindow: true, active: true});

  if (tabs.length === 0) return;
  const tab = tabs[0];
  if (!tab.id) return;

  const response = await browser.tabs.sendMessage(tab.id, message);
};