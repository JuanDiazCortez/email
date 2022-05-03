import React from "react";
import ReactDOM from "react-dom";
import "./modal.css";
function MModalEditor({
  children,
  onClose,
  email,
  classWindow = "modale border border border-primary border-4",
}) {
  return (
    <div id="mmodal-edit"   className={classWindow}>
      <div className="modale-content email">
        <button
          className="btn sticky-top ml-0 text-danger fs-4"
          onClick={onClose}
          style={{
            marginLeft: "-22px",
          }}
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
}
export default function ModalEditor({ children, onClose, email, classWindow }) {
  return ReactDOM.createPortal(
    <MModalEditor onClose={onClose} email={email} classWindow={classWindow}>
      {children}
    </MModalEditor>,
    document.getElementById("modal-portal")
  );
}
