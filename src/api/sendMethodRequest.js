import {
  GraphQLResponseException,
  responseContainErrors,
  responseDataEmpty,
} from '@hyva/react-checkout/api/utility';
import env from '@hyva/react-checkout/utils/env';
import { config } from '@hyva/react-checkout/config';
import RootElement from '@hyva/react-checkout/utils/rootElement';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import { SET_PAGE_MESSAGE } from '@hyva/react-checkout/context/App/page/types';

export const RESPONSE_TEXT = 'text';
export const RESPONSE_JSON = 'json';

const storeCode = env.storeCode || RootElement.getStoreCode();

/**
 * Allow to send GET, POST, PUT, DELETE requests.
 *
 * Default sendRequest in react checkout allow us to send only GET or POST request.
 */
export default function sendMethodRequest(
  dispatch,
  // eslint-disable-next-line default-param-last
  queryParams = {},
  relativeUrl,
  responseType = 'json',
  additionalHeaders = {},
  isGetRequest = false,
  methodType = false
) {
  const headers = {
    'Content-Type': 'application/json',
    Store: storeCode,
    ...additionalHeaders,
  };
  let method = isGetRequest ? 'GET' : 'POST';

  if (methodType) {
    method = methodType;
  }
  const token = LocalStorage.getCustomerToken();
  const url = `${config.baseUrl}${relativeUrl || '/graphql'}`;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = { headers, method };

  if (!isGetRequest) {
    fetchOptions.body = JSON.stringify({ ...queryParams });
  }

  return fetch(url, fetchOptions)
    .then((response) => {
      if (response.ok && responseType === RESPONSE_TEXT) {
        return response.text();
      }
      return response.json();
    })
    .then((response) => {
      if (!responseContainErrors(response) || !responseDataEmpty(response)) {
        return response;
      }

      const exception = new GraphQLResponseException(response);

      dispatch({
        type: SET_PAGE_MESSAGE,
        payload: { type: 'error', message: exception.message },
      });
      throw exception;
    })
    .catch((exception) => {
      console.error(exception);
      throw exception;
    });
}
