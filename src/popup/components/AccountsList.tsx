import React from "react";
import type { Account } from "../types";
import AccountDisplay from "./Account";

const AccountsList = ({
  accounts,
  isPlus,
  showPlusPopup,
}: {
  accounts: Account[];
  isPlus: boolean;
  showPlusPopup: () => void;
}) => (
  <div className="text-center">
    <div>
      {accounts.map((account) => (
        <AccountDisplay
          account={account}
          key={account.name}
          isPlus={isPlus}
          showPlusPopup={showPlusPopup}
        />
      ))}
    </div>
  </div>
);

export default AccountsList;
