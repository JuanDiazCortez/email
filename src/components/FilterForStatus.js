import React, { useState, useEffect } from "react";
import shortid from "shortid";

function FilterForStatus({ data, setData, status, releer, loading }) {
  const [filterText, setfilterText] = useState("Filtrar x estatus");
  const [option, setoption] = useState(null);

  useEffect(() => {
    if (loading && option !== null) {
    }
  }, [loading]);

  useEffect(() => {
    console.log(data);
  }, []);
  const onClickFilter = (opt) => {
    setoption(opt);
    console.log(`filter x --> ${opt}`);
    setfilterText(opt);
    /* recarga la data loading avisa */
    let newList = data.filter((mail) => mail.state === option);
    setData(newList);
  };
  // console.log(status);
  return (
    <div
      className="ml-2 btn-group"
      style={{ marginLeft: "2rem", marginBottom: "4px" }}
    >
      <button
        type="button"
        className="fs-4 btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-target="#navbarNavDarkDropdown"
      >
        {filterText}
      </button>
      <ul
        className="dropdown-menu"
        onClick={(ev) => {
          onClickFilter(ev.target.textContent);
        }}
      >
        {Object.keys(status).map((s) => (
          <li className="fs-4 dropdown-item" key={shortid.generate()}>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilterForStatus;
