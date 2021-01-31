import { createContext, useContext } from "react";
import { dbApiFetcher } from "lib/api-fetcher";
import useSWR from "swr";

const ApiConfigContext = createContext(null);

export function ApiConfigWrapper({ children }) {
  const { data } = useSWR("/config", dbApiFetcher);

  return (
    <ApiConfigContext.Provider value={data}>
      {children}
    </ApiConfigContext.Provider>
  );
}

export function useApiConfigContext() {
  return useContext(ApiConfigContext);
}
