// src/context/AppContext.js
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [movieCount, setMovieCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);

  return (
    <AppContext.Provider value={{ movieCount, setMovieCount, visitorCount, setVisitorCount }}>
      {children}
    </AppContext.Provider>
  );
};
