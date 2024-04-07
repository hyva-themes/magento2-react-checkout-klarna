import { useMemo } from 'react';

import useCartContext from '@hyva/react-checkout/hook/useCartContext';

export default function useKlarnaCartContext() {
  const { cart, placeOrder } = useCartContext();
  const cartData = useMemo(
    () => ({
      email: cart?.email,
      isVirtual: cart?.isVirtual,
      billingAddress: cart?.billing_address,
      shippingAddress: cart?.shipping_address,
    }),
    [
      cart?.email,
      cart?.isVirtual,
      cart?.billing_address,
      cart?.shipping_address,
    ]
  );

  return {
    cartData,
    placeOrder,
  };
}
