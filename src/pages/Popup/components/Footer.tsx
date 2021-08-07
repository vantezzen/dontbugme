import React from "react";
import bmc from '../../../assets/img/bmc.png';

const Footer = ({ isPlus, openPlusPopup } : { isPlus: boolean, openPlusPopup: () => void }) => (
  <div className="text-brand-text-2 mt-8 text-xs flex flex-col items-center text-center">
    {/* <p>
      Results provided by <a href="https://bugmenot.com" className="text-brand-main">BugMeNot.com</a>.<br />This extension is not affiliated with BugMeNot.com.<br /><br />
    </p> */}

    <p>
      Developed by <a href="https://github.com/vantezzen" target="_blank" className="text-brand-main">vantezzen</a>.
    </p><br />

    <div className="coffee flex justify-center items-center">
      {!isPlus && (
        <button 
          className="bg-brand-card rounded flex justify-center items-center text-white px-4 py-3 my-4 mr-3 w-full transform duration-300 hover:scale-105"
          onClick={openPlusPopup}
        >
          Get Plus
        </button>
      )}
      <a href="https://www.buymeacoffee.com/vantezzen" className="w-full h-full" target="_blank" onClick={() => window.plausible('coffee')}>
        <img src={bmc} alt="Buy Me A Coffee" width="150" />
      </a>
    </div>
  </div>
)
export default Footer;