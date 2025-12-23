import React, { createContext, useContext, useMemo, useState } from 'react';

export type SearchParams = {
  query: string;
  year?: string;
  type?: string;
};

type SearchContextValue = {
  search: SearchParams;
  setSearch: (next: SearchParams) => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearchState] = useState<SearchParams>({ query: '' });

  const setSearch = (next: SearchParams) => setSearchState(next);

  const value = useMemo(
    () => ({
      search,
      setSearch,
    }),
    [search],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return ctx;
}


