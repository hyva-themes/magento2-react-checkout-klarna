import { useContext } from 'react';

import KlarnaContext from '../context';

export default function useKlarnaContext() {
  return useContext(KlarnaContext);
}
