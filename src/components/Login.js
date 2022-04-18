import React from "react";
import { useState } from "react";
import Inscripcion from "./Inscripcion";
import UserPassword from "./UserPassword";

function Login({ user, password, setters }) {
  /* en el evento envio los datos al backend 
      la respuesta es que encontro ese usuario con esos datos o no!
      */

  const [showInscript, setshowInscript] = useState(false);

  return (
    <div className="form">
      <div className="card">
        {!showInscript ? (
          <UserPassword
            setters={setters}
            user={user}
            password={password}
            inscript={false}
          />
        ) : null}
      </div>
      {!showInscript ? (
        <div className="login-registrarse">
          <button
            onClick={(ev) => setshowInscript(true)}
            className="btn btn-outline-success p-2 my-sm-0 btn-form "
          >
            Registrarse
          </button>
        </div>
      ) : null}

      <div>
        {showInscript ? (
          <div>
            <Inscripcion insInScript={showInscript} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Login;
