import { RESPONSE_TEXT } from '@hyva/react-checkout/api/sendRequest';
import { config } from '@hyva/react-checkout/config';

import modifier from './modifier';
import klarnaConfig from '../../utility/config';
import sendMethodRequest from '../sendMethodRequest';

export default async function updateAuthorizationToken(
  dispatch,
  authorizationToken
) {
  const { authorizationTokenUpdateUrl } = klarnaConfig;
  const authorizationTokenUpdateRelativeUrl =
    authorizationTokenUpdateUrl.replace(config.baseUrl, '');

  return modifier(
    await sendMethodRequest(
      dispatch,
      { authorization_token: authorizationToken },
      authorizationTokenUpdateRelativeUrl,
      RESPONSE_TEXT,
      {},
      false,
      'PUT'
    )
  );
}
