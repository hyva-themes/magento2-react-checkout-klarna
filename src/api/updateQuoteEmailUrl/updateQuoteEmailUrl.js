import sendRequest, {
  RESPONSE_TEXT,
} from '@hyva/react-checkout/api/sendRequest';
import { config } from '@hyva/react-checkout/config';

import modifier from './modifier';
import klarnaConfig from '../../utility/config';

export default async function updateQuoteEmailUrl(dispatch, email) {
  const { updateQuoteEmailUrl: updateEmailUrl } = klarnaConfig;
  const updateQuoteRelativeUrl = updateEmailUrl.replace(config.baseUrl, '');

  return modifier(
    await sendRequest(
      dispatch,
      { email },
      updateQuoteRelativeUrl,
      RESPONSE_TEXT
    )
  );
}
