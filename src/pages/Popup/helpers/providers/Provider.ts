import { Account } from "../../../../types";

/**
 * A password provider that gives us shared password for a page
 */
export default interface Provider {
  // Does the provider support voting for items
  supportsVote: boolean;

  // Name of the provider for unique identification
  name : string;

  /**
   * Get a list of accounts for a domain
   */
  getAccounts(domain : string) : Promise<Account[] | false>;

  /**
   * Vote for an account, if it works or not.
   * This can throw an exception if the provider doesn't support voting
   */
  voteForAccount(account : Account, works : boolean) : Promise<void>;
}