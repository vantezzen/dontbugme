import type { PlasmoContentScript } from "plasmo";
import browser from "webextension-polyfill";
import "./styles.css";

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"],
};

// CSS selectors that hopefully give us the correct input elements
const possibleUsernameInput = [
  'input[autocomplete="username"]',
  "input[name=username]",
  "input[name=user]",
  "input[id=user]",
  "input[id=username]",
  "input[type=text]",
];
const possibleEmailInput = [
  "input[type=email]",
  "input[name=email]",
  "input[name=mail]",
  "input[id=email]",
  "input[id=user_email]",
  "input[id=mail]",
];
const possiblePasswordInput = [
  'input[autocomplete="current-password"]',
  "input[type=password]",
  "input[name=password]",
  "input[name=pass]",
  "input[id=password]",
  "input[id=user_password]",
  "input[id=pass]",
  "input[placeholder~=Password]",
  "input[placeholder~=Passwort]",
  "input[placeholder~=Kennwort]",
  "input[placeholder~=Passe]",
  "input[placeholder~=Contraseña]",
  "input[placeholder~=Senha]",
  "input[placeholder~=密码]",
  "input[placeholder~=Adgangskode]",
  "input[placeholder~=Hasło]",
  "input[placeholder~=Wachtwoord]",
];

/**
 * Check if an element is visible and not hidden by CSS
 */
const isVisible = (element: HTMLElement) => {
  return (
    element.style.display !== "none" &&
    element.style.visibility !== "hidden" &&
    element.style.opacity !== "0"
  );
};

///// START BITWARDEN
// The following code is based on code in https://github.com/bitwarden/browser/blob/ef4dddcef3/src/content/autofill.js
// Modifications:
// 1. Include "isFirefox" directly in the code
// 2. Update Code to include TypeScript type declarations
// 3. Add "valueToSet" attribute to set the desired value directly
// 4. Switch to using const instead of var

function clickElement(el: HTMLElement) {
  if (!el || (el && "function" !== typeof el.click)) {
    return false;
  }
  el.click();
  return true;
}

// normalize the event since firefox handles events differently than others
function normalizeEvent(el: HTMLInputElement, eventName: string) {
  var ev;
  if (
    navigator.userAgent.indexOf("Firefox") !== -1 ||
    navigator.userAgent.indexOf("Gecko/") !== -1
  ) {
    ev = document.createEvent("KeyboardEvent");
    // @ts-ignore
    ev.initKeyEvent(
      eventName,
      true,
      false,
      null,
      false,
      false,
      false,
      false,
      0,
      0
    );
  } else {
    ev = el.ownerDocument.createEvent("Events");
    ev.initEvent(eventName, true, false);
    // @ts-ignore
    ev.charCode = 0;
    // @ts-ignore
    ev.keyCode = 0;
    // @ts-ignore
    ev.which = 0;
  }

  return ev;
}

// focus an element and optionally re-set its value after focusing
function doFocusElement(el: HTMLInputElement, setValue: boolean) {
  if (setValue) {
    var existingValue = el.value;
    el.focus();
    el.value !== existingValue && (el.value = existingValue);
  } else {
    el.focus();
  }
}

// set value of the given element
function setValueForElement(el: HTMLInputElement, valueToSet: string) {
  el.value = valueToSet;
  clickElement(el);
  doFocusElement(el, true);
  normalizeEvent(el, "keydown");

  el.dispatchEvent(normalizeEvent(el, "keydown"));
  el.dispatchEvent(normalizeEvent(el, "keypress"));
  el.dispatchEvent(normalizeEvent(el, "keyup"));
  el.value !== valueToSet && (el.value = valueToSet);
}

// set value of the given element by using events
function setValueForElementByEvent(el: HTMLInputElement, valueToSet: string) {
  const ev1 = el.ownerDocument.createEvent("HTMLEvents");
  const ev2 = el.ownerDocument.createEvent("HTMLEvents");

  el.value = valueToSet;
  el.dispatchEvent(normalizeEvent(el, "keydown"));
  el.dispatchEvent(normalizeEvent(el, "keypress"));
  el.dispatchEvent(normalizeEvent(el, "keyup"));
  ev2.initEvent("input", true, true);
  el.dispatchEvent(ev2);
  ev1.initEvent("change", true, true);
  el.dispatchEvent(ev1);
  el.blur();
  el.value !== valueToSet && (el.value = valueToSet);
}

///// END BITWARDEN

/**
 * Insert a string into all elements that match a CSS selector
 * Will return true if there were elements that the value could be inserted into
 */
function insertToFieldsWithSelector(selector: string, value: string): boolean {
  let success = false;
  const elements = Array.from(document.querySelectorAll(selector));

  for (const e of elements) {
    const element = e as HTMLInputElement;

    if (!isVisible(element)) continue;

    setValueForElement(element, value);
    setValueForElementByEvent(element, value);
    success = true;

    // Animate input
    element.classList.add("com-dontbugme-animated-fill");
    setTimeout(() => {
      element.classList.remove("com-dontbugme-animated-fill");
    }, 200);
  }

  return success;
}

browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.command === "autofill") {
    const { user, password } = msg;

    // Autofill credentials using the possible selectors
    // Once a working selector has been found, don't try to fill in more
    for (const selector of possibleUsernameInput) {
      if (insertToFieldsWithSelector(selector, user)) {
        break;
      }
    }
    for (const selector of possiblePasswordInput) {
      if (insertToFieldsWithSelector(selector, password)) {
        break;
      }
    }
    // for(const selector of possibleEmailInput) {
    //   insertToFieldsWithSelector(selector, other);
    // }

    return true;
  }
});
