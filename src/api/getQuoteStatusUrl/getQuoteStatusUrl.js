import sendRequest, {
  RESPONSE_TEXT,
} from '@hyva/react-checkout/api/sendRequest';
import { config } from '@hyva/react-checkout/config';

import modifier from './modifier';
import klarnaConfig from '../../utility/config';

export default async function getQuoteStatusUrl(dispatch, authorizationToken) {
  const { getQuoteStatusUrl: getStatusUrl } = klarnaConfig;
  const getQuoteStatusRelativeUrl = getStatusUrl.replace(config.baseUrl, '');

  return modifier(
    await sendRequest(
      dispatch,
      { authorization_token: authorizationToken },
      getQuoteStatusRelativeUrl,
      RESPONSE_TEXT
    )
  );
}
