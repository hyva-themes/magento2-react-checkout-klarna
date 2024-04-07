import React, { useEffect } from 'react';

import { useCheckoutFormContext } from '@hyva/react-checkout/hook';
import { paymentMethodShape } from '@hyva/react-checkout/utils/payment';
import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';

import {
  useKlarnaLoader,
  useKlarnaContext,
  useKlarnaPlaceOrder,
  useKlarnaAppContext,
  useKlarnaPaymentMethodFormContext,
} from '../hooks';
import { getContainerId, getLogoId, getLogoUrl, getTitle } from '../utility';

let paymentSelectTimer;

function KlarnaForm({ method, selected }) {
  const methodCode = method.code;
  const isSelected = methodCode === selected.code;

  const { config } = useKlarnaContext();
  const { setPageLoader } = useKlarnaAppContext();
  const { registerPaymentAction } = useCheckoutFormContext();
  const placeOrderAction = useKlarnaPlaceOrder({ methodCode });
  const { fields, setFieldValue } = useKlarnaPaymentMethodFormContext();

  useKlarnaLoader({ methodCode, isSelected });

  const handlePaymentMethodSelection = async () => {
    setPageLoader(true);
    setFieldValue(fields.code, methodCode);
    clearTimeout(paymentSelectTimer);
    // Considering time to initialize klarna and show loader untill that time.
    paymentSelectTimer = setTimeout(() => {
      setPageLoader(false);
    }, 600);
  };

  useEffect(() => {
    registerPaymentAction(methodCode, placeOrderAction);
  }, [methodCode, placeOrderAction, registerPaymentAction]);

  const label = (
    <label
      htmlFor={`paymentMethod_${methodCode}`}
      className="flex items-center space-x-3"
    >
      <span className="inline-block ml-2">
        <img
          width="55"
          alt="Klarna"
          id={getLogoId(methodCode)}
          src={getLogoUrl(methodCode)}
        />
      </span>
      <span className="inline-block">{getTitle(methodCode)}</span>
    </label>
  );

  return (
    <div>
      <RadioInput
        label={label}
        value={methodCode}
        name="paymentMethod"
        checked={isSelected}
        onChange={handlePaymentMethodSelection}
      />
      {isSelected && (
        <>
          <div id={getContainerId(methodCode)} />
          <fieldset
            style={{ display: 'none' }}
            id={`payment_form_${methodCode}`}
            className="fieldset items klarna_kp"
          >
            <input
              type="hidden"
              name="payment[authorization_token]"
              value={config.authorizationToken || ''}
              id={`authorization_token_${methodCode}`}
            />
          </fieldset>
        </>
      )}
    </div>
  );
}

KlarnaForm.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default KlarnaForm;
