/**
 * DontBugMe Autofill
 * Basic Autofill Script that tries to fill in the input fields of a login screen
 */
import { browser } from "webextension-polyfill-ts";

// CSS selectors that hopefully give us the correct input elements
const possibleUsernameInput = [
  'input[type=text]',
  'input[name=user]',
  'input[name=username]',
  'input[id=user]',
  'input[id=username]'
]
const possibleEmailInput = [
  'input[type=email]',
  'input[name=email]',
  'input[name=mail]',
  'input[id=email]',
  'input[id=user_email]',
  'input[id=mail]'
]
const possiblePasswordInput = [
  'input[type=password]',
  'input[name=password]',
  'input[name=pass]',
  'input[id=password]',
  'input[id=user_password]',
  'input[id=pass]',
  'input[placeholder~=Password]',
  'input[placeholder~=Passwort]',
  'input[placeholder~=Kennwort]',
  'input[placeholder~=Passe]',
  'input[placeholder~=Contraseña]',
  'input[placeholder~=Senha]',
  'input[placeholder~=密码]',
  'input[placeholder~=Adgangskode]',
  'input[placeholder~=Hasło]',
  'input[placeholder~=Wachtwoord]',
]

/**
 * Create a full keyboard event containing charCode, keyCode etc.
 */
const createKeyboardEvent = (name : string, element : HTMLInputElement) => {
  if (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('Gecko/') !== -1) {
    // Firefox requires using its own API
    const ev = document.createEvent('KeyboardEvent');
    // @ts-ignore
    ev.initKeyEvent(name, true, false, null, false, false, false, false, 0, 0);
    return ev;
  }

  const ev = element.ownerDocument.createEvent('Events');
  ev.initEvent(name, true, false);

  // @ts-ignore 2339
  ev.charCode = 0;
  // @ts-ignore 2339
  ev.keyCode = 0;
  // @ts-ignore 2339
  ev.which = 0;
  // @ts-ignore 2339
  ev.srcElement = el;
  // @ts-ignore 2339
  ev.target = el;

  return ev;
}

/**
 * Check if an element is visible and not hidden by CSS
 */
const isVisible = (element : HTMLElement) => {
  return (
    element.style.display !== 'none' &&
    element.style.visibility !== 'hidden' &&
    element.style.opacity !== '0'  
  )
};

/**
 * Insert a string into all elements that match a CSS selector
 */
function insertToFieldsWithSelector(selector : string, value : string) {
  const elements = Array.from(document.querySelectorAll(selector));

  for (const e of elements) {
    const element = e as HTMLInputElement;

    if (!isVisible(element)) continue;

    // Pretend interaction with the element
    element.click();
    element.focus();
    element.dispatchEvent(createKeyboardEvent('keydown', element));
    element.dispatchEvent(createKeyboardEvent('keypress', element));
    element.dispatchEvent(createKeyboardEvent('keyup', element));

    element.value = value;

    // Animate input
    element.classList.add('com-dontbugme-animated-fill');
    setTimeout(() => {
      element.classList.remove('com-dontbugme-animated-fill');
    }, 200);
  }
}

browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.command === 'autofill') {
    const { user, password } = msg;

    // Autofill credentials
    for(const selector of possibleUsernameInput) {
      insertToFieldsWithSelector(selector, user);
    }
    for(const selector of possiblePasswordInput) {
      insertToFieldsWithSelector(selector, password);
    }
    // for(const selector of possibleEmailInput) {
    //   insertToFieldsWithSelector(selector, other);
    // }

    return true;
  }
});