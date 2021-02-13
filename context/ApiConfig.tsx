import { dbApiFetcher } from "lib/api-fetcher";
import * as React from "react";
import useSWR from "swr";

const ApiConfigContext = React.createContext(null);

export function ApiConfigWrapper({ children }: { children: React.ReactChild }) {
  const { data } = useSWR("/config", dbApiFetcher);

  return (
    <ApiConfigContext.Provider value={data}>
      {children}
    </ApiConfigContext.Provider>
  );
}

export function useApiConfigContext() {
  return React.useContext(ApiConfigContext);
}
