import React, { useState } from "react";


function BookEditorForm({ onClose, book }) {
  const [company, setCompany] = useState(book.company);
  const [adress, setAdress] = useState(book.adress);

  const handleSubmit = (ev) => {
    ev.preventDefault();
  };

  const handleOk = (ev) => {
    console.log("modal ok");
  };

  const handleCancel = (ev) => {
    console.log("modal cancel");
    onClose();
  };
  return (
    <div className="form-delete-modal">
      <div className="text-center mt-0">
        <h3>Adress Book Edition</h3>
      </div>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="d-flex flex-row">
          <label className="form-label mt-2">Companía</label>
          <input
            className="form-control ms-3"
            value={company}
            onChange={(ev) => setCompany(ev.target.value)}
          />
        </div>
        <div className="d-flex flex-row">
          <label className="form-label mt-2">Address</label>
          <input
            className="form-control"
            value={adress}
            style={{ marginLeft: "2rem" }}
            onChange={(ev) => setAdress(ev.target.value)}
          />
        </div>
        <div className="d-grid gap-2 mt-5" onClick={handleOk}>
          <button className="btn btn-primary mb-0" type="button">
            Ok
          </button>
          <button
            className="btn btn-warning mb-0"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookEditorForm;
