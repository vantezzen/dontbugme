/**
 * DontBugMe Browser Extension.
 * Easily insert credentials from BugMeNot.com into any page.
 * This extension is not affiliated to BugMeNot.com in any way.
 * 
 * @copyright   Copyright vantezzen (https://github.com/vantezzen)
 * @link        https://github.com/vantezzen/dontbugme
 * @license     https://opensource.org/licenses/mit-license.php MIT License
 */
(() => {
  function insertToField(selector, value) {
    const element = document.querySelector(selector);

    if (!element) return;
    element.value = value;

    // Animate input
    element.classList.add('com-dontbugme-animated-fill');
  }

  const possibleUsernameInput = [
    'input[type=text]',
    'input[name=email]',
    'input[name=mail]',
    'input[name=user]',
    'input[name=username]',
    'input[id=email]',
    'input[id=mail]',
    'input[id=user]',
    'input[id=username]',
  ]
  const possiblePasswordInput = [
    'input[type=password]',
    'input[name=password]',
    'input[name=pass]',
    'input[id=password]',
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

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command === 'fill') {
      console.debug('%c[DontBugMe] Autofilling credentials', 'color: #636363;', msg);

      const { user, password, autosubmit } = msg;

      // Autofill credentials
      for(const selector of possibleUsernameInput) {
        insertToField(selector, user);
      }
      for(const selector of possiblePasswordInput) {
        insertToField(selector, password);
      }

      // Try to autosubmit
      if (autosubmit && document.querySelector('input[type=password]')) {
        document.querySelector('input[type=password]').form.submit()
      }

      sendResponse(true);
      return true;
    }
  });
})();