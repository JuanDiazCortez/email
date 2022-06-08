import React, { useState, useEffect, useContext } from "react";
import Context from "./Context/GlobalContext";
import { Watch } from "react-loader-spinner";
const {
  URL_DATABASE,
  PORT_BACKEND,
  onRetrieveUrl,
  retrieveAllFromDb,
  getStyleForState,
} = require("./constants");

function ShowColorState() {
  return (
    <div className="d-flex flex-row flex-start">
      <div
        className="ml-4 fw-ligth"
        style={{
          marginBottom: "3px",
          color: "green",
          borderRadius: "1rem ",
          marginLeft: "1rem",
          backgroundColor: getStyleForState({ state: "normal", leido: false }),
        }}
      >
        Normal
      </div>

      <div className="d-flex flex-row mb-1 ml-2">
        <div
          className="fw-ligth "
          style={{
            color: "#5c5c15",
            borderRadius: "1rem ",
            marginLeft: "4px",
            backgroundColor: getStyleForState({
              state: "reenviado",
              leido: false,
            }),
          }}
        >
          Reenviados
        </div>
      </div>

      <div className="d-flex flex-row mb-1">
        <div
          className="fw-ligth "
          style={{
            color: "red",
            borderRadius: "1rem ",
            marginLeft: "4px",
            backgroundColor: getStyleForState({ state: "spam", leido: false }),
          }}
        >
          Spam
        </div>
      </div>
    </div>
  );
}

function EmailFilter({ onClickButton, setVolver, volver }) {
  console.log(`${URL_DATABASE}:${PORT_BACKEND}`);
  const [historicos, sethistoricos] = useState(0);
  const [cantidad, setcantidad] = useState(20);

  const data = useContext(Context);
  const [loadingDb, setLoadingDb] = useState(false);

  console.log(data);

  useEffect(() => {
    console.log("component mount");
    console.log("rendering");
    onRetrieveUrl(
      `http://${URL_DATABASE}:${PORT_BACKEND}/retrieveCount`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cantidad: cantidad }),
      },
      function (content) {
        sethistoricos(content.cantidad);
      }
    );
  }, []);

  const onClickVolverButton = (ev) => {
    console.log("volver click");
    setVolver(!volver);
  };

  const onClickTodos = async (ev) => {
    setLoadingDb(true);
    await retrieveAllFromDb(function (data, err) {
      if (err) return console.log(err);
      console.log(data);
      setLoadingDb(false);
      return data;
    });
  };
  return (
    <div
      className="ml-1 mt-4 fs-4 d-flex flex-row"
      role="main"
      style={{
        marginLeft: "1rem",
        fontSize: "4rem",
        height: "4rem",
        backgroundColor: "cornflowerblue",
      }}
    >
      <form className="form fs-4 d-flex" onSubmit={(e) => e.preventDefault()}>
        <div className="row ">
          <div className="col ">
            <div className="d-flex flex-row ">
              <label
                className="form-label "
                htmlFor="id_cantidad"
                style={{
                  marginTop: "-7px",
                }}
              >
                Traer los últimos
              </label>
              <input
                className="form-control fs-4"
                type="numeric"
                id="id_cantidad"
                placeholder="Traer los últimos"
                value={cantidad}
                onChange={(ev) => {
                  setcantidad(ev.target.value);
                }}
              />
            </div>
          </div>
          <div className="col fs-4">
            <p className="fs-4 mt-0">
              Historicos en el server {historicos} correos
            </p>
          </div>
          <div className="col fs-4">
            <div
              className="btn-group ml-1 mp-0 d-flex"
              role="group"
              aria-label="Button group example"
            >
              <div className="col fs-4">
                <button
                  type="button"
                  className="btn btn-primary ml-1 mp-0 fs-4"
                  onClick={(ev) => {
                    onClickButton(ev, cantidad);
                  }}
                >
                  Recuperar
                </button>
              </div>
              <div className="col d-flex flex-row  justify-content-center ">
                <button
                  type="button"
                  className="btn btn-primary fs-4"
                  onClick={(ev) => {
                    onClickVolverButton(ev);
                  }}
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col"
          style={{
            alignItems: "flex-start",
          }}
        >
          <div className="btn-primary fs-4" style={{ borderRadius: "1rem " }}>
            <button
              className="btn-primary"
              onClick={onClickTodos}
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="recupera todos los correos del server de correo info"
              style={{ borderRadius: "1rem ", maxHeight: "4rem" }}
            >
              Recuperar todos los emails del server
            </button>
          </div>
        </div>
      </form>
      <ShowColorState className="ml-4 " />
      <div
        id="spinner"
        style={{
          backgroundColor: "catblue",
          width: "calc(30% - 10px)",
          marginLeft: "2rem",
        }}
      >
        {loadingDb ? (
          <div
            className="d-flex flex-row"
            style={{
              marginTop: "-10px",
            }}
          >
            <Watch
              visible={loadingDb}
              type="Watch"
              color="#00BFFF"
              height={50}
              width={50}
              style={{
                left: "50%",
              }}
            />
            <h2
              style={{
                marginTop: "0px",
                marginLeft: "18px",
                color: "white",
              }}
            >
              Cargando emails
            </h2>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EmailFilter;
