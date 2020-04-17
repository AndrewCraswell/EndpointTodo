import React, { createContext, useCallback, useState, useMemo, useContext } from 'react';

interface ICacheContext {
  isCacheEnabled: boolean;
  setCacheEnabled: (isCacheEnabled: boolean) => void;
}

const cacheContextDefault: ICacheContext = {
  isCacheEnabled: false,
  setCacheEnabled: () => { }
}

const CacheContext = createContext<ICacheContext>(cacheContextDefault);

export const UseCacheProvider: React.FunctionComponent = ({ children }) => {
  const [isCacheEnabled, setCacheEnabled] = useState<boolean>(cacheContextDefault.isCacheEnabled);

  const setUseCache = useCallback((isUseCache: boolean) => {
    setCacheEnabled(isUseCache)
  }, []);

  const cacheMemo = useMemo<ICacheContext>(() => {
    return {
      isCacheEnabled,
      setCacheEnabled: setUseCache
    }
  }, [isCacheEnabled, setUseCache]);

  return (
    <CacheContext.Provider value={cacheMemo}>
      {children}
    </CacheContext.Provider>
  );
}

export const useCache = () => {
  const cacheContext = useContext(CacheContext);

  return cacheContext;
}
