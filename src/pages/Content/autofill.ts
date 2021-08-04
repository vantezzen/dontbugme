import { browser } from "webextension-polyfill-ts";

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

function insertToField(selector : string, value : string) {
  const element = document.querySelector(selector) as HTMLInputElement;

  if (!element) return;
  element.value = value;

  // Animate input
  element.classList.add('com-dontbugme-animated-fill');
  setTimeout(() => {
    element.classList.remove('com-dontbugme-animated-fill');
  }, 200);
}

browser.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.command === 'autofill') {
    const { user, password } = msg;

    // Autofill credentials
    for(const selector of possibleUsernameInput) {
      insertToField(selector, user);
    }
    for(const selector of possiblePasswordInput) {
      insertToField(selector, password);
    }
    // for(const selector of possibleEmailInput) {
    //   insertToField(selector, other);
    // }

    return true;
  }
});