import { useCallback, useMemo, useState } from 'react';

import RootElement from '@hyva/react-checkout/utils/rootElement';

const paymentConfig = RootElement.getPaymentConfig();
const kpConfig = paymentConfig.klarna_kp || {};

export default function useKlarnaConfig() {
  const [hasErrors, setHasErrors] = useState(false);
  const [clientToken, setClientToken] = useState(kpConfig.client_token);
  const [authorizationToken, setAuthorizationToken] = useState(
    kpConfig.authorization_token
  );

  const hasMessage = useCallback(
    () =>
      kpConfig.message !== null || clientToken === null || clientToken === '',
    [clientToken]
  );

  return useMemo(
    () => ({
      hasErrors,
      hasMessage,
      clientToken,
      setHasErrors,
      setClientToken,
      authorizationToken,
      setAuthorizationToken,
      redirectUrl: kpConfig.redirect_url,
      updateQuoteEmailUrl: kpConfig.update_quote_email_url,
    }),
    [authorizationToken, clientToken, hasErrors, hasMessage]
  );
}
