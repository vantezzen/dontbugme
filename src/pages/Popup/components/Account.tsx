import React from 'react';
import { Key, User } from 'react-feather';
import { Account } from '../../../types';
import { autofillData } from '../helpers/autofill';
import getSuccessRateColor from '../helpers/successRateColor';

const Account = ({ account } : { account: Account }) => (
  <button 
    className="bg-brand-card rounded flex p-4 my-4 justify-items-stretch items-stretch w-full transform duration-300 hover:scale-105"
    title="Auto-fill"
    onClick={async () => {
      autofillData(account.name, account.password);
    }}
  >
    
    {/* Success Rate indicator */}
    <div 
      className="w-2 rounded-lg mr-3" 
      style={{ backgroundColor: getSuccessRateColor(account.successRate) }}
      title={`${Math.round(account.successRate * 100)}% success rate`}
    />

    {/* Account Info */}
    <div className="flex flex-col justify-center text-left">
      <h3 className="text-brand-text-1 font-semibold">{account.name}</h3>
      <span className="text-brand-text-2 text-sm">{account.password}</span>
    </div>

    {/* Action buttons */}
    <div onClick={(e) => e.stopPropagation()} className="ml-auto flex justify-center">

      {/* Copy Username */}
      <button 
        className="text-brand-main"
        onClick={() => navigator.clipboard.writeText(account.name)}
        title="Copy username"
      >
        <User />
      </button>

      {/* Copy Password */}
      <button 
        className="text-brand-main ml-3"
        onClick={() => navigator.clipboard.writeText(account.password)}
        title="Copy password"
      >
        <Key />
      </button>

    </div>

  </button>
);

export default Account;