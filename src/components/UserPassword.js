import React from "react";
import { useState } from "react";
const {
  URL_DATABASE,
  PORT_BACKEND,
  URL_PROTOCOL,
  printMail,
  Status
} = require("./constants");
// import './../components/browser.css';
//rfce
const UserPassword = ({ user, password, setters, isInScript }) => {
  console.log(setters);

  const fetchUser = async () => {
    let respuesta = await fetch(
      `http://${URL_DATABASE}:${PORT_BACKEND}/loginUser`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user: user, password: password })
      }
    );
    let result = await respuesta.json();
    console.log(result);
    return result;
  };

  const fxSubmit = async (ev) => {
    ev.preventDefault();

    let responseBackend = await fetchUser();
    if (responseBackend) {
      setters.setCredenciales(responseBackend.result);
    }
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://mdbootstrap.com/img/Photos/new-templates/bootstrap-login-form/img1.jpg"
                    alt="login form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form type="submit" onSubmit={fxSubmit}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219" }}
                        ></i>
                        <span className="h1 fw-bold mb-0">Logo</span>
                      </div>

                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Sign into your account
                      </h5>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          value={user}
                          onChange={(ev) => setters.setUser(ev.target.value)}
                        />
                        <label className="form-label" htmlFor="form2Example17">
                          Usuario
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          id="form2Example27"
                          value={password}
                          onChange={(ev) =>
                            setters.setPassword(ev.target.value)
                          }
                        />
                        <label className="form-label" htmlFor="form2Example27">
                          Password
                        </label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          type="submit"
                          className="btn btn-dark btn-lg btn-block"
                        >
                          Login
                        </button>
                      </div>

                      <a className="small text-muted" href="#!">
                        Forgot password?
                      </a>
                      <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                        Don't have an account?{" "}
                        <a href="#!" style={{ color: "#393f81" }}>
                          Register here
                        </a>
                      </p>
                      <a href="#!" className="small text-muted">
                        Terms of use.
                      </a>
                      <a href="#!" className="small text-muted">
                        Privacy policy
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPassword;
