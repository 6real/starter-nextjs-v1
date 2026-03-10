'use client';

import React, { createContext, useContext, useMemo } from 'react';

import type { Dictionary } from './get-dictionary';

interface DictionaryContextValue {
  dict: Dictionary;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function useDictionary(): DictionaryContextValue {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within DictionaryProvider');
  }
  return context;
}

interface DictionaryProviderProps {
  dict: Dictionary;
  children: React.ReactNode;
}

export const DictionaryProvider = ({ dict, children }: DictionaryProviderProps) => {
  const value = useMemo(() => ({ dict }), [dict]);

  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>;
};
