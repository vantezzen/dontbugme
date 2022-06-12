import Popup from "./Popup";
import "./index.css";

import "fontsource-poppins/300.css";
import "fontsource-poppins";
import "fontsource-poppins/600.css";
import "fontsource-poppins/700.css";
import "fontsource-poppins/800.css";
import "fontsource-poppins/900.css";

import "./external/plausible";

// @ts-ignore
window.plausible =
  window.plausible ||
  function () {
    // @ts-ignore
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };

export default Popup;
