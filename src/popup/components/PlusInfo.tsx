import React from "react";
import { useState } from "react";
import { Storage } from "@plasmohq/storage";
import verifyLicense from "../helpers/license";
import logo from "data-base64:~assets/icon512.png";

import "./PlusInfo.scss";

const storage = new Storage();

const PlusInfo = ({
  onClose,
  triggerValidation,
}: {
  onClose: () => void;
  triggerValidation: () => Promise<void>;
}) => {
  const [screen, setScreen] = useState("info");
  const [licenseKey, setKey] = useState("");
  const [activateInfo, setActivateInfo] = useState("");

  return (
    <div className="plus-info text-brand-text-1">
      <button
        className="close-button text-black"
        onClick={() => {
          window.plausible("plusinfo_close_top");
          onClose();
        }}
      >
        &times;
      </button>

      <div className="plus-icon">
        <img src={logo} />
      </div>

      {screen === "info" && (
        <>
          <h2 className="font-bold mb-3">
            Get more out of DontBugMe with DontBugMe Plus
          </h2>

          <p>
            Thank you for using "DontBugMe" to increase your privacy and comfort
            online.
          </p>
          <p>
            To help keep the development of "DontBugMe" alive without needing to
            sell user data, some features require "DontBugMe Plus".
          </p>
          <p>
            "DontBugMe Plus" is a <b>one-time payment of $4</b> and allows you
            to activate Plus across <b>all your personal devices</b> - so you
            won't have to purchase mutliple licenses!
          </p>

          <button
            className="button-primary bg-brand-main text-black mt-3"
            onClick={() => {
              window.plausible("plusinfo_open_gumroad");
              window.open("https://vantezzen.gumroad.com/l/vXoaYS");
            }}
          >
            Learn more and buy license
          </button>
          <button
            onClick={() => {
              window.plausible("plusinfo_click_activate");
              setScreen("activate");
            }}
            className="button-primary bg-brand-text-1 text-black"
          >
            Activate License
          </button>
        </>
      )}

      {screen === "activate" && (
        <>
          <label htmlFor="key">License Key</label>
          <input
            type="text"
            id="key"
            placeholder="000000-00000-000-000000"
            value={licenseKey}
            onChange={(evt) => setKey(evt.target.value)}
          />
          {activateInfo && <p>{activateInfo}</p>}

          <button
            onClick={async () => {
              if (licenseKey.length === 0) {
                setActivateInfo("Please enter a license key");
                window.plausible("empty_license");
                return;
              }

              setActivateInfo("Validating your license...");

              const isValid = await verifyLicense(licenseKey, true);
              if (isValid) {
                await storage.set("license", licenseKey);
                await triggerValidation();
                setScreen("activated");
                window.plausible("activated");
              } else {
                setActivateInfo("This license key is not valid.");
                window.plausible("invalid_license", {
                  props: { key: licenseKey },
                });
              }
            }}
            className="button-primary bg-brand-main text-black"
          >
            Activate License
          </button>
          <button
            onClick={() => setScreen("info")}
            className="button-primary bg-brand-text-1 text-black"
          >
            Go Back
          </button>
        </>
      )}

      {screen === "activated" && (
        <>
          <h2>DontBugMe Plus has been activated!</h2>

          <p>
            Thank you for purchasing DontBugMe Plus. Your donation helps
            continue developing DontBugMe!
          </p>
          <p>You can now use all of DontBugMe's features.</p>

          <button
            onClick={onClose}
            className="button-primary bg-brand-main text-black"
          >
            Start using DontBugMe Plus
          </button>
        </>
      )}

      <button
        onClick={() => {
          window.plausible("plusinfo_close_bottom");
          onClose();
        }}
        className="close-link"
      >
        Close
      </button>
    </div>
  );
};

export default PlusInfo;
