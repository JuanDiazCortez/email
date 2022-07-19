import React, { useState } from "react";
import sendMail from "../../assets/SendMassEmail.svg";
import MyEditor from "../MyEditor";
function TestComponent(props) {
  const [texto, setTexto] = useState("");
  const inpuStyle = { height: "28px" };
  return (
    <div>
      <div className="card mt-2">
        <div
          className="mt-0 mr-4"
          style={{
            height: "8rem",
            marginRight: "8rem",
            background: "linear-gradient(#e66465, #9198e5);",
          }}
        >
          <MyEditor texto="" position="20rem" />
        </div>
        <form className="form">
          <div className="d-flex flex-row">
            <div className="mt-4">
              <img src={sendMail} alt="" style={{ height: 53, width: 36 }} />
            </div>
            <div className="d-flex flex-column ms-4 mt-4 w-75">
              <div className="d-flex flex-row mb-2">
                <label className="form-label  m2-1" htmlFor="id_to">
                  To..
                </label>
                <input
                  className="form-control mr-1"
                  id="id_to"
                  style={inpuStyle}
                />
              </div>
              <div className="d-flex flex-row mb-2">
                <label className="form-label  m2-1">Cc..</label>
                <input className="form-control mr-2" style={inpuStyle} />
              </div>
              <div className="d-flex flex-row mb-2">
                <label className="form-label  m2-1">Bc..</label>
                <input className="form-control mr-2" style={inpuStyle} />
              </div>
              <div className="d-flex flex-row mb-2">
                <label className="form-label" style={{ marginLeft: "-25px" }}>
                  Subject
                </label>
                <input className="form-control mr-2" style={inpuStyle} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TestComponent;
