import React, { createContext, useState } from "react";

const GloblaContext = React.createContext({});

export function GlobalContextProvider({ children }) {
  const [settings, setsettings] = useState([]);
  
  return (
    <GloblaContext.Provider value={{ settings, setsettings }}>
      {children}
    </GloblaContext.Provider>
  );
}

export default GloblaContext;
