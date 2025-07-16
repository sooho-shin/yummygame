"use client";
import React, { createContext, useContext } from "react";

export const DictionaryContext = createContext<Record<string, string>>({});
import Format from "string-format";

export function DictionaryProvider({
  children,
  dictionary,
}: {
  children: React.ReactNode;
  dictionary: Record<string, string>;
}) {
  return (
    <DictionaryContext.Provider value={dictionary}>
      {children}
    </DictionaryContext.Provider>
  );
}

export const useDictionary = () => {
  const dictionary = useContext(DictionaryContext);

  return (key: string, formatData: string[] = []) => {
    const text = dictionary[key] || key;
    return formatData.length > 0 ? Format(text, ...formatData) : text;
  };
};
