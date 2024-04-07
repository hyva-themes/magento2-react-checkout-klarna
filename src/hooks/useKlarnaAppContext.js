import useAppContext from '@hyva/react-checkout/hook/useAppContext';

export default function useKlarnaAppContext() {
  const { isLoggedIn, appDispatch, setPageLoader, setErrorMessage } =
    useAppContext();

  return { isLoggedIn, appDispatch, setPageLoader, setErrorMessage };
}
