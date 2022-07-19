import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Configuration from "./components/Configuration/Configuration";
import EEditor from "./components/EEditor";
import Inscripcion from "./components/Inscripcion";
import AddressBook from "./components/AddressBook";
import LoguedAppComponent from "./components/LoguedAppComponent";
import UserPassword from "./components/UserPassword";
import TestComponent from "./components/TestComponent";

import { GlobalContextProvider } from "./components/Context/GlobalContext";
import { EmailContextProvider } from "./components/Context/EmailContext";

import { SelectEmailContextProvider } from "./components/Context/SelectEmailContext";
import "./App.css";

const { URL_DATABASE, PORT_BACKEND } = require("./components/constants");

function App() {
  console.log(`${URL_DATABASE}:${PORT_BACKEND}`);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [credenciales, setCredenciales] = useState(
    JSON.parse(localStorage.getItem("creds"))
  );

  // const [salir, setSalir] = useState(false);

  const salirOfSystem = () => {
    localStorage.removeItem("creds");
    window.location = "/";
  };
  const valid_credentials = () => {
    if (credenciales !== null) {
      return true;
    }
    //   console.log("1");
    let creds = JSON.parse(localStorage.getItem("creds"));
    console.log(`credenciales en ls ${JSON.stringify(creds)}`);
    console.log("2");
    if (credenciales === null) {
      console.log("NO HABIA credenciales en state ");
      console.log("3");
      console.log(credenciales);
      if (creds !== null) {
        console.log("4");
        console.log("HABIA credenciales en ls");
        console.log("5");
        setCredenciales(creds);
        return true;
      }
    } else {
      //  console.log("6");
      return false;
    }
  };

  function setCred(c) {
    console.log(`seteando credenciales del dialogo ${c}`);
    if (c !== null && c !== undefined) {
      console.log(c);
      localStorage.setItem("creds", JSON.stringify(c));
      setCredenciales(c);
    } else {
    }
  }
  console.log("--------000000");
  if (!valid_credentials()) {
    console.log("000000");
    console.log("check credenciales");
    return (
      <div>
        <UserPassword
          user={user}
          password={password}
          setters={{
            setUser: setUser,
            setPassword: setPassword,
            setCredenciales: setCred,
          }}
        />
      </div>
    );
  }
  const Salir = ({ salirOfSystem }) => {
    console.log("salir");
    return (
      <div
        className="container"
        style={{ width: "100%", height: "100%", backgroundColor: "catblue" }}
      >
        <div className="mt-4">
          <h2>Seguro desea salir del sistema?</h2>
          <div
            className=" d-flex flex-row justify-content-between mt-1"
            style={{ width: "20%" }}
          >
            <button onClick={salirOfSystem}> Si </button>
            <button> No </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <GlobalContextProvider value={{}}>
      <div
        id="id-main"
        className="container-fluid mb-3"
        style={{
          backgroundColor: "darkgrey",
          marginTop: "-12px",
        }}
      >
        <h2 className="fw-bolder">{`Richelet Info Email `}</h2>
        <h5
          style={{
            marginTop: "-12px",
          }}
        >{`server   :${URL_DATABASE}`}</h5>

        <Router forceRefresh={false}>
          <nav
            className="nav-bar navbar-dark mt-0 "
            style={{ marginTop: "-8px" }}
          >
            <hr style={{ color: "white", marginTop: "8px" }} />
            <ul
              className="nav  nav-tabs bg-secundary fw-bold fs-2 ms-auto border border-4 border-top"
              style={{
                backgroundColor: "##d9d2d2",
                marginTop: "8px",
              }}
            >
              <li className="nav-item fw-bold">
                <Link to="/mails">Mails</Link>
              </li>

              <li className="nav-item fw-bold">
                <Link to="/addressBook">Address Book</Link>
              </li>

              <li className="nav-item fw-bold">
                <Link to="/inscripcion">Inscribirse</Link>
              </li>

              <li className="nav-item fw-bold">
                <Link to="/editor">Editor</Link>
              </li>

              <li className="nav-item fw-bold">
                <Link to="/configuracion">Configuracion</Link>
              </li>

              <li className="nav-item fw-bold">
                <Link to="/testComponent">Test Component</Link>
              </li>

              <li className="nav-item fw-bold">
                <Link to="/salir">Salir</Link>
              </li>
            </ul>
          </nav>
          <EmailContextProvider value={{}}>
            <SelectEmailContextProvider value={{ credenciales }}>
              <Routes forceRefresh={false}>
                <Route
                  path="/mails"
                  element={<LoguedAppComponent credenciales={credenciales} />}
                />
                <Route
                  path="/addressBook"
                  element={<AddressBook credenciales={credenciales} />}
                />
                <Route
                  path="/inscripcion"
                  element={<Inscripcion credenciales={credenciales} />}
                />
                <Route
                  path="/editor"
                  exact
                  forceRefresh={false}
                  element={<EEditor credenciales={credenciales} />}
                />
                <Route
                  path="/configuracion"
                  exact
                  forceRefresh={false}
                  element={<Configuration credenciales={credenciales} />}
                />
                <Route
                  path="/testComponent"
                  exact
                  forceRefresh={false}
                  element={<TestComponent credenciales={credenciales} />}
                />

                <Route
                  path="/salir"
                  exact
                  forceRefresh={false}
                  element={
                    <Salir
                      credenciales={credenciales}
                      salirOfSystem={salirOfSystem}
                    />
                  }
                />
              </Routes>
            </SelectEmailContextProvider>
          </EmailContextProvider>
        </Router>
      </div>
    </GlobalContextProvider>
  );
}

export default App;
