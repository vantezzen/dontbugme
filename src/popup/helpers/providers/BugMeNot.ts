import { hasCache, readCache, writeCache } from "../cache";
import type { Account } from "../../types";
import type Provider from "./Provider";

/**
 * Provider Class for BugMeNot
 */
export class BugMeNot implements Provider {
  supportsVote = true;

  name = "BugMeNot";

  async getAccounts(domain: string) {
    const res = await fetch(`http://bugmenot.com/view/${domain}`);
    const html = await res.text();

    // Turn response into html element
    const embedElement = document.createElement("div");
    embedElement.innerHTML = html;
    const page = embedElement.querySelector("#content");

    if (!page) {
      return false;
    }

    // Check if there are accounts
    if (page.getElementsByClassName("account").length == 0) {
      return false;
    }

    // Get accounts
    const accounts: Account[] = [];
    const accountElements = page.getElementsByClassName("account");
    for (const accountEl of Array.from(accountElements)) {
      if (accountEl === null) continue;

      const accId = Number(accountEl.getAttribute("data-account_id")) || -1;

      const siteIdElement = accountEl.querySelector(
        'input[name="site"]'
      ) as HTMLInputElement;
      const siteId = siteIdElement ? Number(siteIdElement.value) : -1;

      const kbd = accountEl.querySelectorAll("kbd");
      const successString =
        accountEl.querySelector(".success_rate")?.textContent || "";
      const successRate = Number(/\d{1,3}/.exec(successString)?.[0] || 1);

      const account = {
        id: accId,
        provider: this.name,
        site: siteId,
        name: kbd[0].innerHTML,
        password: kbd[1].innerHTML,
        successRate: successRate / 100,
      };
      accounts.push(account);
    }

    return accounts;
  }

  async voteForAccount(account: Account, didWork: boolean) {
    if (localStorage[`voted-${account.id}-${account.site}`] === "yes") {
      // Ignore duplicate votes
      return;
    }

    await fetch("http://bugmenot.com/vote.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `site=${account.site}&account=${account.id}&vote=${
        didWork ? "Y" : "N"
      }`,
    });
    localStorage[`voted-${account.id}-${account.site}`] = "yes";
  }
}
