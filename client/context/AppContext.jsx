import { createContext, useState } from 'react';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const value = {
    alert,
    setAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
