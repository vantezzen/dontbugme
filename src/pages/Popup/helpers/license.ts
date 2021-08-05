import { browser } from 'webextension-polyfill-ts';
import { hasCache, writeCache } from './cache';

/**
 * Verify License for DontBugMe Plus
 * 
 * @param license License Key from Gumroad
 * @param increase_count Should this verification increase the count of uses?
 * @returns True if valid
 */
export default async function verifyLicense(license : string | undefined = undefined, increase_count = false) : Promise<boolean> {
  let key = license;
  if (key === undefined) {
    key = (await browser.storage.local.get('license'))?.license;
    if (!key) return false;
  }

  if (hasCache(`plus-cache-${key}`)) {
    return true;
  }

  let formData = new FormData();
  formData.append('product_permalink', 'vXoaYS');
  formData.append('license_key', key);
  formData.append('increment_uses_count', String(increase_count));

  try {
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (data && data.uses < 100) {
      writeCache(`plus-cache-${key}`, 'yes');
      return true;
    }
  } catch(e) {}
  return false;
}
