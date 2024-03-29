import React from 'react';
import logo from 'data-base64:~assets/icon512.png';

const Header = () => (
  <div className="flex justify-center items-center">
    <img src={logo} alt="Logo" className="w-12" />
    <span className="text-xl text-brand-main font-extrabold">
      DontBugMe
    </span>
  </div>
);

export default Header;