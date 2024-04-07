import { useCallback, useEffect, useMemo, useState } from 'react';

import log from '../utility/log';
import klarna from '../utility/klarna';
import useKlarnaContext from './useKlarnaContext';
import useKlarnaCartContext from './useKlarnaCartContext';

let loadTimeout = null;
let initTimeout = null;

export default function useKlarnaLoader({ methodCode, isSelected }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [apiScriptLoaded, setApiScriptLoaded] = useState(false);
  const { cartData } = useKlarnaCartContext();
  const { setSectionLoader, setShowButton, config } = useKlarnaContext();
  const { clientToken, hasMessage, setHasErrors } = config;

  const actions = useMemo(() => ({ setHasErrors }), [setHasErrors]);

  const loadKlarna = useCallback(() => {
    try {
      setSectionLoader(true);
      klarna.load(methodCode, cartData, actions, (res) => {
        log(res);
        setShowButton(res.show_form);
        setSectionLoader(false);
      });

      return true;
    } catch (e) {
      log(e);
      setSectionLoader(false);
      return false;
    }
  }, [actions, cartData, methodCode, setShowButton, setSectionLoader]);

  const debounceKlarnaLoad = useCallback(() => {
    loadTimeout = setTimeout(loadKlarna, 200);

    return () => clearTimeout(loadTimeout);
  }, [loadKlarna]);

  useEffect(() => {
    if (isSelected && apiScriptLoaded && isInitialized) {
      debounceKlarnaLoad();
    }
  }, [isSelected, isInitialized, apiScriptLoaded, debounceKlarnaLoad]);

  useEffect(() => {
    if (!apiScriptLoaded) {
      return;
    }

    if (isInitialized || hasMessage()) {
      // Don't try to initialize Klarna
      setIsInitialized(true);
      return;
    }

    initTimeout = setTimeout(() => {
      klarna.init(clientToken);
      setIsInitialized(true);
    }, 200);

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(initTimeout);
  }, [apiScriptLoaded, clientToken, hasMessage, isInitialized]);

  useEffect(() => {
    const klarnaApiScript = document.createElement('script');
    const headElement = document.getElementsByTagName('head')[0];
    klarnaApiScript.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js';
    klarnaApiScript.async = false; // optionally

    klarnaApiScript.onload = () => {
      setApiScriptLoaded(true);
    };

    headElement.insertBefore(klarnaApiScript, headElement.firstChild);
  }, []);
}
