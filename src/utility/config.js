import RootElement from '@hyva/react-checkout/utils/rootElement';

const paymentConfig = RootElement.getPaymentConfig();
const kpConfig = paymentConfig.klarna_kp || {};

export default {
  debug: kpConfig.debug,
  message: kpConfig.message,
  b2bEnabled: kpConfig.b2b_enabled,
  redirectUrl: kpConfig.redirect_url,
  isKecSession: kpConfig.is_kec_session,
  updateSessionUrl: kpConfig.update_session_url,
  dataSharingOnload: kpConfig.data_sharing_onload,
  getQuoteStatusUrl: kpConfig.get_quote_status_url,
  updateQuoteEmailUrl: kpConfig.update_quote_email_url,
  authorizationTokenUpdateUrl: kpConfig.authorization_token_update_url,
};
