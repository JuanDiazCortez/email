import React, { useEffect, useState, useContext } from "react";
import EmailContext from "../Context/EmailContext";
// import { getSentEmails } from "../constants";

const SelectEmailContext = React.createContext({});

export function SelectEmailContextProvider({ children, credenciales }) {
  // console.log(`SelectEmailContextProvider ${credenciales}`);
  const { data, setData } = useContext(EmailContext);
  const [spam, setSpam] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [sentOuterEmails, setOuterEmails] = useState([]);
  const [readedEmails, setReaderEmails] = useState([]);
  const [changeFilter, setChangeFilter] = useState(false);

  const updateReaded = () => {
    let leidos;
    if (data) {
      leidos = data.filter((email) => email.leido);
      setReaderEmails(leidos);
    }
  };

  useEffect(() => {
    // updateReaded();
  }, [changeFilter]);

  // console.log(sentEmails);
  return (
    <SelectEmailContext.Provider
      value={{
        sentEmails,
        setSentEmails,
        selectedRows,
        setSelectedRows,
        readedEmails,
        setReaderEmails,
        sentOuterEmails,
        setOuterEmails,
        changeFilter,
        setChangeFilter,
        spam,
        setSpam,
      }}
    >
      {children}
    </SelectEmailContext.Provider>
  );
}
export default SelectEmailContext;
