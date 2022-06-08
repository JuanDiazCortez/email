import React, { useState, useEffect } from "react";
import shortid from "shortid";
const {
  onRetrieveUrl,
  URL_DATABASE,
  URL_PROTOCOL,
  PORT_BACKEND,
  DEFAULT_POST_HEADER,
} = require("../constants");

function ListSites({ lista }) {
  console.log(lista);
  let datos;
  try {
    console.log(JSON.stringify(lista));
    datos = lista.lista.servers;
    console.log(datos);
  } catch (error) {
    console.log(error);
    datos = [];
  }
  return (
    <div className="container">
      <ul className="dropdown">
        {datos.map((server) => (
          <li key={shortid.generate()}>
            <div>
              <p>{server.url}</p>
              <div>{server.port}</div>
              <div>{server.user}</div>
              <div>{server.password}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TabPreferencias({ credenciales }) {
  console.log("PREFERENCIASSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    console.log("component mount prefs");
    const loadRef = async () => {
      await retrievePrefs();
    };
    loadRef();
  }, []);

  const retrievePrefs = async () => {
    let header = {
      ...DEFAULT_POST_HEADER,
      body: JSON.stringify({
        user: credenciales,
      }),
    };
    console.log(header);
    onRetrieveUrl(
      `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/retrievePrefs`,
      header,
      function (result) {
        setPrefs(result);
      }
    );
  };

  return (
    <div>
      <ListSites lista={prefs} />
    </div>
  );
}

export default TabPreferencias;
