import React, { useState, useEffect } from "react";
import shortid from "shortid";

const errorStyle = {
  border: "1px solid #ddd",
  marginTop: "-1px",
  backgroundColor: "#f6f6f6",
  padding: "12px",
  textDecoration: "none",
  fontSize: "18px",
  color: "black",
  display: "block",
  position: "relative",
};

function ErroresStack({ errorList, setListError }) {
  const [lista, setLista] = useState([]);
  useEffect(() => {
    setLista(errorList);
  }, []);

  const remove = (error) => {
    console.log("remove" + error);
    let l = lista.filter(function (ele) {
      return ele !== error;
    });
    if (l.length === 0) {
      setListError(false);
    }
    console.log(l);
    setLista(l);
  };

  console.log(errorList);
  return (
    <div className="card">
      <ul className="list-unstyled">
        {lista.map((error, index) => (
          <li
            key={shortid.generate()}
            className="itemError text-danger"
            style={errorStyle}
          >
            <div className="d-flex flex-col">
              {error}
              <span onClick={(ev) => remove(error)} className="close">
                x
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ErroresStack;
