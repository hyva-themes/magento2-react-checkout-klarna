import { useCallback, useMemo } from 'react';
import { usePerformPlaceOrderByREST } from '@hyva/react-checkout/hook';

import useKlarnaContext from './useKlarnaContext';
import {
  setPaymentMethodRequest,
  updateSessionUrlRequest,
  getQuoteStatusUrlRequest,
  updateQuoteEmailUrlRequest,
  updateAuthorizationTokenRequest,
} from '../api';
import log from '../utility/log';
import klarna from '../utility/klarna';
import useKlarnaAppContext from './useKlarnaAppContext';
import useKlarnaCartContext from './useKlarnaCartContext';
import { getCategoryId, mageRedirect, redirectToSuccessPage } from '../utility';

export default function useKlarnaPlaceOrder({ methodCode }) {
  const { cartData } = useKlarnaCartContext();
  const { config, setShowButton } = useKlarnaContext();
  const performPlaceOrder = usePerformPlaceOrderByREST(methodCode);
  const { appDispatch, setErrorMessage, setPageLoader, isLoggedIn } =
    useKlarnaAppContext();
  const { email } = cartData;
  const { hasMessage } = config;
  const categoryId = getCategoryId(methodCode);
  const { setAuthorizationToken, setHasErrors } = config;
  const actions = useMemo(
    () => ({ setHasErrors, setAuthorizationToken }),
    [setAuthorizationToken, setHasErrors]
  );

  /**
   * Performing the full authorization workflow
   */
  const performAuthorizationWorkflow = useCallback(
    async (values) => {
      klarna.authorize(
        categoryId,
        cartData,
        actions,
        async (klarnaAuthorizeResult) => {
          setPageLoader(true);
          log(klarnaAuthorizeResult);
          const { isApproved, authorizationToken } = klarnaAuthorizeResult;

          if (!isApproved) {
            return;
          }

          try {
            await setPaymentMethodRequest(
              appDispatch,
              methodCode,
              authorizationToken
            );
            const result = await getQuoteStatusUrlRequest(
              appDispatch,
              authorizationToken
            );

            if (result.isActive) {
              await updateAuthorizationTokenRequest(
                appDispatch,
                authorizationToken
              );
              await performPlaceOrder(values, {});
            } else {
              await updateSessionUrlRequest(appDispatch, authorizationToken);

              if (window.hyva) {
                window.hyva.setCookie('mage-cache-sessid', '', -1, true);
                window.dispatchEvent(
                  new CustomEvent('reload-customer-section-data')
                );
              }
              setShowButton(klarnaAuthorizeResult.show_form);
              mageRedirect(config.redirectUrl);
              redirectToSuccessPage();
            }
          } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
          }
          setPageLoader(false);
        }
      );
    },
    [
      actions,
      cartData,
      categoryId,
      methodCode,
      appDispatch,
      setShowButton,
      setPageLoader,
      setErrorMessage,
      performPlaceOrder,
      config.redirectUrl,
    ]
  );

  /**
   * Updating the email because for guests it can be zero when the billing and shipping address are different.
   * After it performing the authorization workflow.
   */
  const updateEmailAndPerformAuthorizationWorkflow = useCallback(
    async (values) => {
      setPageLoader(true);
      try {
        await updateQuoteEmailUrlRequest(appDispatch, email);
        await performAuthorizationWorkflow(values);
      } catch (error) {
        console.error(error);
      }
      setPageLoader(false);
    },
    [appDispatch, email, performAuthorizationWorkflow, setPageLoader]
  );

  return useCallback(
    async (values) => {
      if (hasMessage()) {
        return;
      }

      if (isLoggedIn) {
        await performAuthorizationWorkflow();
        return;
      }

      await updateEmailAndPerformAuthorizationWorkflow(values);
    },
    [
      hasMessage,
      isLoggedIn,
      performAuthorizationWorkflow,
      updateEmailAndPerformAuthorizationWorkflow,
    ]
  );
}
