import React, { useState, useEffect, useContext } from "react";
import Context from "./Context/GlobalContext";
import { Watch } from "react-loader-spinner";
import * as modules from "./constants";

const {
  PORT_BACKEND,
  getStyleForState,
  onRetrieveUrl,
  URL_DATABASE,
  retrieveAllFromDb,
} = modules;

// console.log(modules);
function ShowColorState() {
  return (
    <div
      className="d-flex flex-row flex-start  align-items-center ms-3"
      style={{ marginTop: "-12px" }}
    >
      <div
        className="ml-4 fw-ligth"
        style={{
          // marginBottom: "3px",

          color: "green",
          borderRadius: "1rem ",
          marginLeft: "1rem",
          backgroundColor: getStyleForState({ state: "normal", leido: false }),
          alignItems: "center",
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
      <form
        className="form fs-4 d-flex  align-items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="row">
          <div
            className="col d-flex flex-row "
            style={{
              width: "12rem",
            }}
          >
            <label
              className="form-label "
              htmlFor="id_cantidad"
              style={{
                width: "95px",
              }}
            >
              Traer los últimos
            </label>
            <input
              className="form-control fs-4 w-25"
              type="numeric"
              id="id_cantidad"
              placeholder="Traer los últimos"
              value={cantidad}
              onChange={(ev) => {
                setcantidad(ev.target.value);
              }}
              // style={{
              //   marginTop: "-4px",
              // }}
            />
          </div>
          <div className="col fs-4">
            <p className="fs-4 mt-0">
              Historicos en el server {historicos} correos
            </p>
          </div>
          <div className="col fs-4">
            <div
              id="id-botns"
              className="d-flex btn-group ml-1 mp-0 col"
              role="group"
              aria-label="Button group example"
            >
              <button
                className="btn btn-primary ms-1"
                type="button"
                onClick={(ev) => {
                  onClickButton(ev, cantidad);
                }}
                style={{ borderRadius: "1rem ", maxHeight: "4rem" }}
              >
                Recuperar
              </button>

              <button
                className="btn btn-primary ms-1"
                type="button"
                onClick={onClickVolverButton}
                style={{ borderRadius: "1rem ", maxHeight: "4rem" }}
              >
                Volver
              </button>

              <button
                className="btn btn-primary  ms-1"
                type="button"
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
        </div>
        <div
          className="col"
          style={{
            alignItems: "flex-start",
          }}
        ></div>
      </form>
      <ShowColorState className="ms-4 " />
      <div
        id="spinner"
        className="ms-1"
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
