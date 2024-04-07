/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

import KlarnaPaymentWrapper from './KlarnaPaymentWrapper';
import KlarnaForm from './KlarnaForm';

function KlarnaPayment(props) {
  return (
    <KlarnaPaymentWrapper>
      <KlarnaForm {...props} />
    </KlarnaPaymentWrapper>
  );
}

export default KlarnaPayment;
