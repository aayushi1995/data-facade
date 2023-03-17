import React, { createContext, useState, useContext } from 'react';

interface MyContextType {
  myValue: string | undefined;
  setMyValue: React.Dispatch<React.SetStateAction<string>>;
}

export const HomeChatContext = createContext<MyContextType>({
  myValue: 'initial value',
  setMyValue: () => {},
});

export function HomeChatContextProvider({ children }: { children: React.ReactNode }) {
  const [myValue, setMyValue] = useState<string>('');

  return (
    <HomeChatContext.Provider value={{ myValue, setMyValue }}>
      {children}
    </HomeChatContext.Provider>
  );
}