import sendRequest from '@hyva/react-checkout/api/sendRequest';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';

import modifier from './modifier';
import { SET_PAYMENT_METHOD_MUTATION } from './mutation';

export default async function setPaymentMethod(
  dispatch,
  paymentMethod,
  authorizationToken
) {
  const variables = {
    code: paymentMethod,
    authorizationToken,
    cartId: LocalStorage.getCartId(),
  };

  return modifier(
    await sendRequest(dispatch, {
      variables,
      query: SET_PAYMENT_METHOD_MUTATION,
    })
  );
}
