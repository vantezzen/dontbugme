import React from 'react';
import { Account } from '../../../types';
import { default as AccountDisplay } from './Account';

const AccountsList = ({ accounts, isPlus } : { accounts: Account[], isPlus: boolean }) => (
  <div className="text-center">
  
    <div>
      {accounts.map(account => (
        <AccountDisplay account={account} key={account.name} isPlus={isPlus} />
      ))}
    </div>

  </div>
);

export default AccountsList;