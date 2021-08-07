import { Account } from "../../../../types";
import Provider from "./Provider";

export class DemoProvider implements Provider {
  supportsVote = true;

  name = "Demo Provider";

  async getAccounts(domain : string) { 
    return [{
      id: 1,
      provider: this.name,
      site: 123,
      name: 'testUsername',
      password: 'testPassword',
      successRate: 0.5,
    }];
  }

  async voteForAccount(account : Account, didWork : boolean) {
    
  }
}