import { get as _get } from 'lodash-es';

import RootElement from '@hyva/react-checkout/utils/rootElement';

const checkoutConfig = RootElement.getCheckoutConfig();
const paymentConfig = RootElement.getPaymentConfig();

export function getTitle(methodCode) {
  return _get(paymentConfig, `klarna_kp.${methodCode}.title`) || '';
}

export function getLogoUrl(methodCode) {
  return _get(paymentConfig, `klarna_kp.${methodCode}.logo`) || '';
}

export function getLogoId(methodCode) {
  return `klarna_logo_id_${methodCode}`;
}

export function getContainerId(methodCode) {
  return `${methodCode.replace(/_/g, '-')}-container`;
}

export function getCategoryId(methodCode) {
  // Strip off "klarna_"
  return methodCode.substr(7);
}

/**
 * Replicating $.mage.redirect
 */
export function mageRedirect(url, type, timeout, forced) {
  // eslint-disable-next-line no-param-reassign
  forced = !!forced;
  // eslint-disable-next-line no-param-reassign
  timeout = timeout || 0;
  // eslint-disable-next-line no-param-reassign
  type = type || 'assign';

  const _redirect = () => {
    window.location[type](type === 'reload' ? forced : url);
  };

  if (timeout) {
    setTimeout(_redirect, timeout);
    return;
  }

  _redirect();
}

export function redirectToSuccessPage() {
  window.location.replace(checkoutConfig.defaultSuccessPageUrl);
}
