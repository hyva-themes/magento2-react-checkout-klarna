import usePaymentMethodFormContext from '@hyva/react-checkout/components/paymentMethod/hooks/usePaymentMethodFormContext';

export default function useKlarnaPaymentMethodFormContext() {
  const { fields, setFieldValue } = usePaymentMethodFormContext();

  return { fields, setFieldValue };
}
