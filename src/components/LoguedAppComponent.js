import React from "react";
import { useState, useEffect, useContext } from "react";
import { Circles } from "react-loader-spinner";
import BrowserMain from "./BrowserMain";
import EmailFilter from "./EmailFilter";
import EmailContext from "./Context/EmailContext";
import { printMail, Status, onRetrieveUrl } from "./constants";
import { getEmails } from "./Hooks/ApiHooks";

function LoguedAppComponent({ credenciales }) {
  const { data, setData } = useContext(EmailContext);
  const [loading, setloading] = useState(false);
  const [volver, setVolver] = useState(false);

  useEffect(() => {
    console.log("Cambió data");
  }, [data]);

  const onClickButton = async (ev, cantidad) => {
    console.log("recuperar");
    setloading(true);
    let emails = await getEmails(cantidad, credenciales);
    //    console.log(emails);
    setData(emails.data);
    setloading(false);
  };

  return (
    <div className="card">
      <div
        className="form"
        style={{
          backgroundColor: "cornflowerblue"
        }}
      >
        <EmailFilter
          setVolver={setVolver}
          volver={volver}
          onClickButton={onClickButton}
          onRetrieveUrl={onRetrieveUrl}
        />
      </div>
      {loading ? (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translate(-50%, 0)"
          }}
        >
          <Circles
            className="zindex-sticky"
            visible={loading}
            color="#00BFFF"
            height={200}
            width={200}
          />
        </div>
      ) : null}
      {data ? (
        <BrowserMain
          volver={volver}
          setVolver={setVolver}
          onClickButton={onClickButton}
          credenciales={credenciales}
          loading={loading}
        />
      ) : null}
    </div>
  );
}

export default LoguedAppComponent;
