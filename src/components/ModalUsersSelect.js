import React, { useEffect } from "react";
import { useState } from "react";
import shortid from "shortid";
import "./modal.css";
const { onRetrieveUrl } = require("./constants");
const URL_DATABASE = require("./constants").URL_DATABASE;
const PORT_BACKEND = require("./constants").PORT_BACKEND;

function ModalUsersSelect({
  credenciales,
  setShowModal,
  closeModal,
  setUserSelect,
}) {
  //
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    const retrieveList = async () => {
      onRetrieveUrl(
        `http://${URL_DATABASE}:${PORT_BACKEND}/retrieveUlserList`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rows: [],
          }),
        },
        function (result) {
          setListUsers(result.rows);
        }
      );
    };
    retrieveList();
  }, []);
  const selectUser = (user) => {
    setUserSelect(user);
    closeModal(user);
  };
  return (
    <div className="container">
      <h2>Seleccione el destino</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">nombre</th>
            <th scope="col">apellido</th>
            <th scope="col">email</th>
          </tr>
        </thead>
        <tbody>
          {listUsers
            ? listUsers.map((user) => (
                <tr key={shortid.generate()} onClick={() => selectUser(user)}>
                  <td>{user.name}</td>
                  <td className="fs-4 mr-1">{user.apellido}</td>
                  <td className="fs-4 mr-1">{user.email}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <button onClick={(ev) => closeModal(ev)}>Close </button>
    </div>
  );
}

export default ModalUsersSelect;
