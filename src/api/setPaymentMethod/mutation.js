import { CART_DATA_FRAGMENT } from '@hyva/react-checkout/api/cart/utility/query/cartQueryInfo';

export const SET_PAYMENT_METHOD_MUTATION = `
mutation setPaymentMethodMutation(
  $cartId: String!
  $code: String!
  $authorizationToken: String!
) {
  setPaymentMethodOnCart(
    input: {
      cart_id: $cartId
      payment_method: {
        code: $code
        klarna: {
          authorization_token: $authorizationToken
        }
      }
    }
  ) {
  cart {
    ${CART_DATA_FRAGMENT}
    }
  }
}
`;
