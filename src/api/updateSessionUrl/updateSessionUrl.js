import sendRequest, {
  RESPONSE_TEXT,
} from '@hyva/react-checkout/api/sendRequest';
import { config } from '@hyva/react-checkout/config';

import modifier from './modifier';
import klarnaConfig from '../../utility/config';

export default async function updateSessionUrl(dispatch, authorizationToken) {
  const { updateSessionUrl: updateSession } = klarnaConfig;
  const updateSessionRelativeUrl = updateSession.replace(config.baseUrl, '');
  return modifier(
    await sendRequest(
      dispatch,
      { authorization_token: authorizationToken },
      updateSessionRelativeUrl,
      RESPONSE_TEXT
    )
  );
}
