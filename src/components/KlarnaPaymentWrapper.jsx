import React, { useMemo, useState } from 'react';
import { node } from 'prop-types';

import KlarnaContext from '../context';
import { useKlarnaConfig } from '../hooks';

function KlarnaPaymentWrapper({ children }) {
  const [sectionLoader, setSectionLoader] = useState();
  const [showButton, setShowButton] = useState(false);
  const config = useKlarnaConfig();

  const context = useMemo(
    () => ({
      config,
      showButton,
      sectionLoader,
      setShowButton,
      setSectionLoader,
    }),
    [sectionLoader, showButton, config]
  );
  return (
    <KlarnaContext.Provider value={context}>{children}</KlarnaContext.Provider>
  );
}

KlarnaPaymentWrapper.propTypes = {
  children: node.isRequired,
};

export default KlarnaPaymentWrapper;
