import React from "react";
import ReactDOM from "react-dom";
import "./modal.css";
function MModalEditor({ children, onClose, email }) {
  return (
    <div className="modale border border border-primary border-4">
      <div className="modale-content">
        <button
          className="btn sticky-top ml-0 text-danger fs-4"
          onClick={onClose}
          style={{
            marginLeft: "-22px"
          }}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
}
export default function ModalEditor({ children, onClose, email }) {
  return ReactDOM.createPortal(
    <MModalEditor onClose={onClose} email={email}>
      {children}
    </MModalEditor>,
    document.getElementById("modal-portal")
  );
}
