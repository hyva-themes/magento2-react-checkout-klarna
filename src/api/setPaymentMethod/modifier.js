import { get as _get } from 'lodash-es';

import { __ } from '@hyva/react-checkout/i18n';
import { _isArrayEmpty } from '@hyva/react-checkout/utils';
import fetchGuestCartModifier from '@hyva/react-checkout/api/cart/fetchGuestCart/modifier';

export default function setPaymentMethodModifier(result) {
  const errors = _get(result, 'errors');

  if (errors && !_isArrayEmpty(errors)) {
    throw new Error(__('Saving payment method failed.'));
  }

  return fetchGuestCartModifier(result, 'setPaymentMethodOnCart.cart');
}
