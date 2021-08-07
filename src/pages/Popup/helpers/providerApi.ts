import { Account } from "../../../types";
import { hasCache, readCache, writeCache } from "./cache";
import { BugMeNot } from "./providers/BugMeNot";

// Providers that should be used for searching
export const PROVIDERS = [
  new BugMeNot(),
];

/**
 * Retrieves the accounts for a domain from all providers.
 * 
 * @param {string} domain - The domain to retrieve accounts for.
 * @returns {Promise<Account[]>} - A promise that resolves with found accounts of "false" if no accounts can be fetched.
 */
const getAccountsForDomain = async (domain : string) : Promise<Account[] | false> => {
  const cacheKey = `accounts-cache-${domain}`;
  if (hasCache(cacheKey)) {
    console.log('Using cached resultes for domain', domain);
    return readCache(cacheKey);
  }

  let accounts : Account[] | false = [];

  for (const provider of PROVIDERS) {
    const providerAccounts = await provider.getAccounts(domain);
    if (providerAccounts) {
      accounts = [
        ...accounts,
        ...providerAccounts,
      ]
      console.log(`Got ${providerAccounts.length} accounts from provider`);
    }
  }

  accounts.sort((a, b) => b.successRate - a.successRate);

  if (accounts.length === 0) {
    accounts = false;
  }

  // Cache results
  writeCache(cacheKey, accounts);


  return accounts;
}

export default getAccountsForDomain;

/**
 * Vote for an account on the provider to tell others if credentials are valid.
 * This will automatically save that a vote has been cast to prevent duplicate votes.
 */
export const voteForAccount = async (account : Account, didWork : boolean) => {
  const provider = PROVIDERS.find(p => p.name === account.provider);
  if (!provider || !provider.supportsVote) return;

  await provider.voteForAccount(account, didWork);
}