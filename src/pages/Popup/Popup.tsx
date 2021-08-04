import React from 'react';
import { useEffect } from 'react';
import { Frown, Loader } from 'react-feather';
import { Account } from '../../types';
import AccountsList from './components/AccountsList';
import Footer from './components/Footer';
import Header from './components/Header';
import { getCurrentDomain, getPossibleDomains } from './helpers/browser';
import getAccountsForDomain from './helpers/bugMeNotApi';
import './Popup.css';


const Popup = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [accounts, setAccounts] = React.useState<Account[] | false>(false);

  const [fullDomain, setFullDomain] = React.useState<string | false>(false);
  const [domain, setDomain] = React.useState<string | false>(false);

  // Get current tab domain once
  useEffect(() => {
    getCurrentDomain().then(domain => {
      console.log(`Got tab domain ${domain}`);
      setFullDomain(domain);
      setDomain(domain);
    });
  }, []);
  
  // Get accounts everytime the domain changes
  useEffect(() => {
    if (domain) {
      console.log(`Fetching accounts for ${domain}`);
      setIsLoading(true);

      getAccountsForDomain(domain).then((accounts) => {
        setIsLoading(false);
        setAccounts(accounts);

        if (accounts) {
          window.plausible('fetch_success');
        } else {
          window.plausible('fetch_fail');
        }
      });
    }
  }, [domain]);

  return (
    <div className="p-5">
      <Header />

      {/* Main Content */}
      {(isLoading || !domain || !fullDomain) ? (
        <div className="p-5 text-brand-text-2 font-bold flex flex-col items-center mt-5">
          <Loader className="animate-spin h-10" size={30} />
          <h2 className="text-sm mt-2">
            Loading accounts...
          </h2>
        </div>
      ) : (
        <>
          <div className="text-brand-text-2 font-semibold text-sm text-center mt-3">
            Got {' '}
            
            {accounts ? accounts.length : 0}{' '}

            accounts for{' '}

            <select name="domain" className="bg-brand-dark text-brand-text-1 font-bold" onChange={(e) => setDomain(e.target.value)}>
              {getPossibleDomains(fullDomain).map((possibleDomain) => (
                <option key={possibleDomain} value={possibleDomain} selected={possibleDomain === domain}>
                  {possibleDomain}
                </option>
              ))}
            </select>
            :
          </div>

          {(typeof accounts === "object" && accounts.length > 0) ? (
            <AccountsList accounts={accounts} />
          ) : (
            <div className="text-center mt-5 text-brand-text-2 flex flex-col items-center">
              <Frown className="h-10" size={30} />
              <h2 className="text-brand-text-1 font-bold mt-3">
                No accounts found
              </h2>
              <p className="text-sm mt-3">
                BugMeNot does not store any accounts for "{domain}"
              </p>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Popup;
