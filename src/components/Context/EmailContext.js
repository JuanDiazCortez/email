import React, { useState, useEffect } from "react";
// import SelectEmailContext from "./SelectEmailContext";

const EmailContext = React.createContext({});

export function EmailContextProvider({ children }) {
  const [data, setData] = useState();


  useEffect(() => {
    // if (changeFilter) {
    //   console.log(changeFilter);
    //  console.log(setChangeFilter);
    //  setChangeFilter(true);
    //   }
    console.log("-------------------- Change Data --------------------");
  }, [data]);

  return (
    <EmailContext.Provider value={{ data, setData }}>
      {children}
    </EmailContext.Provider>
  );
}
export default EmailContext;
