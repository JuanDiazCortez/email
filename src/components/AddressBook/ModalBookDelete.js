import React from "react";
import ReactDOM from "react-dom";
import "../ModalEditor/modal.css";

function BookModalEditor({ children, onClose, book }) {
  return (
    <div className="modale">
      <div className="modale-content">
        <button className="btn" onClick={onClose}>
          x
        </button>
        {children}
      </div>
    </div>
  );
}
export default function ModalBookDelete({ children, onClose, book }) {
  return ReactDOM.createPortal(
    <BookModalEditor onClose={onClose} book={book}>
      {children}
    </BookModalEditor>,
    document.getElementById("modal-portal")
  );
}
