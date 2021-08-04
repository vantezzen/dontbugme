import React from 'react';
import { Account } from '../../../types';
import { default as AccountDisplay } from './Account';

const AccountsList = ({ accounts } : { accounts: Account[] }) => (
  <div className="text-center">
  
    <div>
      {accounts.map(account => (
        <AccountDisplay account={account} key={account.name} />
      ))}
    </div>

  </div>
);

export default AccountsList;