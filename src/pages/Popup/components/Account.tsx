import React from 'react';
import { useEffect } from 'react';
import { Key, ThumbsDown, ThumbsUp, User } from 'react-feather';
import { toast } from 'react-toastify';
import { Account } from '../../../types';
import { autofillData } from '../helpers/autofill';
import { voteForAccount } from '../helpers/bugMeNotApi';
import getSuccessRateColor from '../helpers/successRateColor';

import "./Account.scss";

const Account = ({ account, isPlus, showPlusPopup } : { account: Account, isPlus: boolean, showPlusPopup: () => void }) => {
  const [showVoteBox, setShowVoteBox] = React.useState(false);
  const [hasCastedVote, setHasCastedVote] = React.useState(false);

  const castVote = (works : boolean) => {
    if (isPlus) {
      voteForAccount(account, works);
      setHasCastedVote(true);

      // Reset last used account so we don't show it again after voting
      localStorage.lastUsedAccount = -1;

      window.plausible('cast_vote', { props: { works } });
    } else {
      window.plausible('cast_vote_non_plus', { props: { works } });

      showPlusPopup();
    }
  }

  const displayVoteBox = () => {
    setShowVoteBox(true);
    localStorage.lastUsedAccount = account.id;
    window.plausible('display_vote_box');
  }

  useEffect(() => {
    // Check if the account is the last used account before the popup was closed
    if (localStorage.lastUsedAccount == account.id) {
      setShowVoteBox(true);
      localStorage.lastUsedAccount = -1;
    }
  }, []);

  const hasAlreadyVoted = localStorage[`voted-${account.id}-${account.site}`] === 'yes';

  let voteBox = (<></>);
  if (hasCastedVote) {
    voteBox = (
      <p className="text-brand-text-2">
        Your vote has been casted.
      </p>
    );
  } else if (hasAlreadyVoted) {
    voteBox = (
      <p className="text-brand-text-2">
        You already voted for this account.
      </p>
    );
  } else {
    voteBox = (
      <div className="grid grid-cols-2 gap-2 text-white mt-3">

        <button 
          className="bg-green-500 rounded flex items-center justify-center p-3 transform hover:scale-105 duration-200"
          onClick={() => castVote(true)}
        >
          <ThumbsUp className="mr-3" />
          Yes
        </button>

        <button 
          className="bg-red-500 rounded flex items-center justify-center p-3 transform hover:scale-105 duration-200"
          onClick={() => castVote(false)}
        >
          <ThumbsDown className="mr-3" />
          No
        </button>

      </div>
    );
  }

  return (
    <>
      <button 
        className="bg-brand-card rounded flex p-4 my-4 justify-items-stretch items-stretch w-full transform duration-300 hover:scale-105 z-10"
        title="Auto-fill"
        onClick={async () => {
          autofillData(account.name, account.password);
          displayVoteBox();
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
            onClick={() => {
              navigator.clipboard.writeText(account.name)
              toast.dark("Username copied")
              displayVoteBox();
            }}
            title="Copy username"
          >
            <User />
          </button>

          {/* Copy Password */}
          <button 
            className="text-brand-main ml-3"
            onClick={() => {
              navigator.clipboard.writeText(account.password)
              toast.dark("Password copied")
              displayVoteBox();
            }}
            title="Copy password"
          >
            <Key />
          </button>

        </div>

      </button>

      {showVoteBox && !hasAlreadyVoted && (
        <div className="mx-3 -mt-4 bg-brand-card p-3 rounded-b votebox">
          <h3 className="font-bold text-white">
            Does this account work?
          </h3>

          {voteBox}

          <button 
            className="text-brand-text-2 text-xs mt-4"
            onClick={() => {
              setShowVoteBox(false);
              localStorage.lastUsedAccount = -1;
            }}
          >
            Dismiss
          </button>

        </div>
      )}
    </>
  );
}

export default Account;