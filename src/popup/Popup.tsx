import React from "react";
import { useEffect } from "react";
import { Frown, Loader, Plus } from "react-feather";
import { ToastContainer, Slide } from "react-toastify";
import type { Account } from "./types";
import AccountsList from "./components/AccountsList";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { getCurrentDomain, getPossibleDomains } from "./helpers/browser";
import getAccountsForDomain from "./helpers/providerApi";
import verifyLicense from "./helpers/license";

import "./Popup.css";
import "react-toastify/dist/ReactToastify.min.css";
import PlusInfo from "./components/PlusInfo";

type PopupState = {
  accounts: Account[] | false;

  domain: string | false;
  fullDomain: string | false;

  isLoading: boolean;
  isPlus: boolean;
  showPlusPopup: boolean;
};

export default class Popup extends React.Component {
  state = {
    accounts: [],

    domain: "",
    fullDomain: "",

    isLoading: false,
    isPlus: false,
    showPlusPopup: false,
  };

  componentDidMount() {
    // Get current tab domain once
    getCurrentDomain().then((domain) => {
      console.log(`Got tab domain ${domain}`);

      window.plausible("open", { props: { site: domain } });
      this.setState({
        domain,
        fullDomain: domain,
      });
    });

    this.checkPlusStatus();
  }

  componentDidUpdate(prevProps: {}, prevState: PopupState) {
    // Get accounts everytime the domain changes
    if (prevState.domain !== this.state.domain) {
      const { domain } = this.state;
      if (domain) {
        console.log(`Fetching accounts for ${domain}`);

        this.setState({
          isLoading: true,
        });

        getAccountsForDomain(domain).then((accounts) => {
          this.setState({
            isLoading: false,
            accounts,
          });

          if (accounts) {
            window.plausible("fetch_success");
          } else {
            window.plausible("fetch_fail");
          }
        });
      } else {
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  async checkPlusStatus() {
    const isValid = await verifyLicense();
    this.setState({
      isPlus: isValid,
    });
  }

  render() {
    const { accounts, domain, fullDomain, isLoading, isPlus, showPlusPopup } =
      this.state;

    let mainContent;

    let accountListItems = accounts;
    let hiddenItems = 0;
    if (!isPlus && accounts && accounts.slice) {
      accountListItems = accounts.slice(0, 4);
      hiddenItems = accounts.length - accountListItems.length;
    }

    if (isLoading) {
      // Loading Screen
      mainContent = (
        <div className="p-5 text-brand-text-2 font-bold flex flex-col items-center mt-5">
          <Loader className="animate-spin h-10" size={30} />
          <h2 className="text-sm mt-2">Loading accounts...</h2>
        </div>
      );
    } else if (!domain || !fullDomain) {
      // Incompatible domain (e.g. Chrome-internal pages)
      mainContent = (
        <div className="text-center mt-5 text-brand-text-2 flex flex-col items-center">
          <Frown className="h-10" size={30} />
          <h2 className="text-brand-text-1 font-bold mt-3">
            Incompatible Domain
          </h2>
          <p className="text-sm mt-3">
            DontBugMe is not compatible with your current page
          </p>
        </div>
      );
    } else {
      mainContent = (
        <>
          <div className="text-brand-text-2 font-semibold text-sm text-center mt-3">
            Got {accounts ? accounts.length : 0} accounts for{" "}
            <select
              name="domain"
              className="bg-brand-dark text-brand-text-1 font-bold"
              onChange={(e) => this.setState({ domain: e.target.value })}
              value={domain}
            >
              {getPossibleDomains(fullDomain).map((possibleDomain) => (
                <option key={possibleDomain} value={possibleDomain}>
                  {possibleDomain}
                </option>
              ))}
            </select>
            :
          </div>

          {typeof accounts === "object" && accounts.length > 0 ? (
            <>
              <AccountsList
                accounts={accountListItems}
                isPlus={isPlus}
                showPlusPopup={() => this.setState({ showPlusPopup: true })}
              />
              {hiddenItems > 0 && (
                <button
                  className="bg-brand-card rounded flex justify-center items-center text-white p-4 my-4 w-full transform duration-300 hover:scale-105"
                  onClick={async () => {
                    this.setState({
                      showPlusPopup: true,
                    });
                  }}
                >
                  <Plus className="mr-2" size={15} /> {hiddenItems} more
                </button>
              )}
            </>
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
      );
    }

    return (
      <div className="p-5">
        <Header />
        {mainContent}
        <Footer
          isPlus={isPlus}
          openPlusPopup={() => this.setState({ showPlusPopup: true })}
        />

        {showPlusPopup && (
          <PlusInfo
            onClose={() => this.setState({ showPlusPopup: false })}
            triggerValidation={() => this.checkPlusStatus()}
          />
        )}

        <ToastContainer
          position="bottom-center"
          transition={Slide}
          autoClose={2000}
        />
      </div>
    );
  }
}
