import React, { useEffect } from "react";
import { useState } from "react";
import ErroresStack from "./ErroresStack";

const {
  URL_DATABASE,
  PORT_BACKEND,
  printMail,
  status,
} = require("./constants");

function Inscripcion({ setter, isInScript }) {
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState(true);
  const [lc, setLc] = useState(false);
  const [du, setDu] = useState(false);
  const [name, setName] = useState("");
  const [passwd, setPasswd] = useState("");
  const [errores, setErrores] = useState([]);
  const [errorFlag, setErrorFlag] = useState(false);

  useEffect(() => {
    console.log("Cambio dni");
    if (dni) {
      setLc(false);
      setDu(false);
    }
  }, [dni]);

  useEffect(() => {
    console.log("Cambio lc");
    if (lc) {
      setDni(false);
      setDu(false);
    }
  }, [lc]);

  useEffect(() => {
    console.log("Cambio Du");
    if (du) {
      setDni(false);
      setLc(false);
    }
  }, [du]);

  const removeError = (lista) => {
    console.log(" removeError");
  };
  const capture = (ev) => {
    console.log(ev);
    setNombre(ev.target.value);
  };

  const check = () => {
    let result = [];

    if (nombre.length === 0) {
      result.push("Debe informar el nombre");
    }

    if (apellido.length === 0) {
      result.push("Debe informar el apellido");
    }
    if (email.length === 0) {
      result.push("Debe informar el mail");
    }

    if (documento.length === 0) {
      result.push("Debe informar el documento");
    }

    if (passwd.length === 0) {
      result.push("Debe informar el password");
    }
    setErrores(result);
    setErrorFlag(result.length !== 0);
    return result.length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    if (!check()) {
      return;
    } else {
      console.log("preventDefault()");

      const send = async () => {
        let bdy = {
          nombre: nombre,
          apellido: apellido,
          email: email,
          documento: documento,
          passwd: passwd,
          user: name,
          pepe: "hola",
        };
        console.log(bdy);
        const response = await fetch(
          `http://${URL_DATABASE}:${PORT_BACKEND}/setdtos`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bdy),
          }
        );
        return await response.json();
      };
      let response = await send();
      console.log(response);
    }
  };

  const jpg = "assets/top.jpg";
  const divStyle = {
    backgroundImage: `url(${jpg})`,
  };

  return (
    <div
      className="container border  border-1 border-primary mt-4"
      style={divStyle}
    >
      <h2 className="center">Formulario de Inscripción</h2>
      {errorFlag ? (
        <ErroresStack errorList={errores} setListError={setErrorFlag} />
      ) : null}
      <form
        onSubmit={(ev) => {
          onSubmit(ev);
        }}
        className="form"
      >
        <div className="col">
          <label htmlFor="id-nombre">Nombre:</label>
          <input
            htmlFor="id-nom-label"
            id="id-nombre"
            type="text"
            value={nombre}
            placeholder="Nombre:"
            onChange={(ev) => {
              capture(ev);
            }}
            className="form-control"
          ></input>
        </div>

        <div className="col mb-3">
          <label className="form-label" htmlFor="id-apelido">
            Apellido:
          </label>
          <input
            id="id-apellido"
            placeholder="Apellido:"
            type="text"
            value={apellido}
            onChange={(ev) => setApellido(ev.target.value)}
            className="form-control"
          ></input>

          <label>Nro. Documento: </label>
          <div className="tipos-doc">
            <input
              type="text"
              value={documento}
              onChange={(ev) => setDocumento(ev.target.value)}
              placeholder="Ingrese su documento"
              className="form-control"
            ></input>
            <div className="d-flex mt-2 flex-row">
              <div className="mb-3 ">
                <label>DNI </label>
                <input
                  type="checkbox"
                  id="id_dni"
                  name="dni"
                  value={dni}
                  checked={dni}
                  onChange={(ev) => setDni(ev.target.value)}
                  className="form-check-input ml-2"
                />
              </div>
              <div className="lc " style={{ marginLeft: "2rem" }}>
                <label className="=form-label ml-2">LC </label>
                <input
                  type="checkbox"
                  id="id_lc"
                  name="lc"
                  value={lc}
                  checked={lc}
                  onChange={(ev) => setLc(ev.target.value)}
                  className="form-check-input ml-4"
                />
              </div>

              <div className="du" style={{ marginLeft: "2rem" }}>
                <label>DU</label>
                <input
                  type="checkbox"
                  id="id_du"
                  name="du"
                  value={du}
                  checked={du}
                  onChange={(ev) => setDu(ev.target.value)}
                  className="form-check-input"
                />
              </div>
            </div>
          </div>

          {/* <div className="col mb-4 d-flex flex-row">
            <label className="form-label" htmlFor="id-genero">
              Género:
            </label>
            <select
              id="id-genero"
              className="form-select "
              onChange={(ev) => setSexo(ev.target.value)}
            >
              <option>Masculino</option>
              <option>Femenino</option>
              <option>No Binario</option>
            </select>
          </div>
 */}
          <div className="mb-3 col">
            <label className="form-label" htmlFor="id-email">
              Correo Electronico:
            </label>
            <input
              type="email"
              id="id-email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="Ingrese su correo electronico"
              className="form-control"
            ></input>
          </div>

          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder="Ingrese nombre de usuario"
              className="form-control"
            ></input>
          </div>
          <div className="mb-3">
            <label>Contraseña:</label>
            <input
              type="password"
              value={passwd}
              onChange={(ev) => setPasswd(ev.target.value)}
              placeholder="Ingrese una contraseña"
              className="form-control"
            ></input>
          </div>

          <div className="btn-group mt-4">
            <button
              type="submit"
              className="btn btn-outline-success p-2 my-sm-0 btn-form"
            >
              Registrarse
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Inscripcion;
