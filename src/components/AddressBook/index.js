import React, { useState, useEffect } from "react";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalBookEditor from "./ModalBookEditor";
import BookEditorForm from "./BookEditorForm";
import BookDeleteForm from "./BookDeleteForm";

import {
  onRetrieveUrl,
  getDataAdreesBook,
  URL_DATABASE,
  PORT_BACKEND,
  URL_PROTOCOL
} from "../constants";

function AddressFilter({ companyFilter, setCompanyFilter }) {
  return (
    <div className="mt-2">
      <form className="form ms-2" onSubmit={(ev) => ev.preventDefault()}>
        <div className="row" role="row">
          <div className="col" role="col">
            <div className="d-flex flex-row ">
              <div className="form-control">
                <label className="form-label">Companía</label>
                <input
                  type="text"
                  className="ms-2"
                  value={companyFilter}
                  onChange={(ev) => {
                    setCompanyFilter(ev.target.value);
                  }}
                />
              </div>
              <div className="d-flex flex-row">
                <label className="label">Búsqueda Contínua</label>
                <input className="input" type="checkbox" />
              </div>
              <div className="form-control">
                <label className="form-label ms-2">email</label>
                <input type="text" className="ms-2" />
              </div>
              <button className="ms-1">Filtrar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function AddressBook() {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState();
  const [page, setPage] = useState(0);
  const [companyFilter, setCompanyFilter] = useState("");
  const [filter, setFilter] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showDeletion, setShowDeletion] = useState(false);

  useEffect(() => {
    console.log("mount AddressBook");
    setBooks([
      { id: 12142, company: "3 Arroyos", adress: "elamarque@3arroyos.com" }
    ]);
    const loadBooks = async () => {
      getDataAdreesBook(page, (libros) => {
        console.log(libros);
        setBooks(libros);
      });
    };
    loadBooks();
    console.log("salio");
  }, []);

  const onClose = () => {
    setShowEditor(false);
  };

  const onCloseDelete = () => {
    setShowDeletion(false);
  };
  const handleClickDeleted = (ev, book) => {
    console.log(`handleDeleted ${book}`);
    setBook(book);
    setShowDeletion(true);
  };
  const handleClickEdit = (ev, book) => {
    console.log(`handleEdit ${JSON.stringify(book, null, 2)}`);
    setBook(book);
    setShowEditor(true);
  };
  return (
    <div className="container mt-2">
      {showEditor && (
        <ModalBookEditor onClose={onClose}>
          <BookEditorForm onClose={onClose} book={book} />
        </ModalBookEditor>
      )}
      {showDeletion && (
        <ModalBookEditor className=".form-delete-modal" onClose={onCloseDelete}>
          <BookDeleteForm onClose={onCloseDelete} book={book} />
        </ModalBookEditor>
      )}

      <AddressFilter
        companyFilter={companyFilter}
        setCompanyFilter={setCompanyFilter}
      />
      <div>
        <table
          className="table table-success table-striped table-hover mt-2"
          style={{ width: "100%" }}
        >
          <thead>
            <tr>
              <th scope="col" className="col" style={{ width: "6%" }}>
                Acción
              </th>

              <th scope="col" className="col-3" style={{ width: "60%" }}>
                Compania
              </th>
              <th scope="col" style={{ width: "25%" }}>
                Emails
              </th>
            </tr>
          </thead>
          <tbody>
            {books
              ? books.map((book) => (
                  <tr key={`td-${book.id}`}>
                    <td key={`tdc-${book.id}`}>
                      <div className="d-flex flex-row  ">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          onClick={(ev) => {
                            handleClickDeleted(ev, book);
                          }}
                          style={{ cursor: "pointer" }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Borrar entrada"
                        />
                        <FontAwesomeIcon
                          className="ml-3"
                          onClick={(ev) => {
                            handleClickEdit(ev, book);
                          }}
                          icon={faEdit}
                          style={{ marginLeft: "0.5rem", cursor: "pointer" }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Editar entrada"
                        />
                      </div>
                    </td>
                    <td /* contenteditable="true" */>
                      <div>
                        <p>{book.company}</p>
                      </div>
                    </td>

                    <td key={`tda-${book.id}`}>
                      <div>{book.adress}</div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        <div className="d-flex flex-row justify-content-between mt-1">
          <button onClick={(ev) => setPage(page - 50)}>Anterior</button>
          <button onClick={(ev) => setPage(page + 50)}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}

export default AddressBook;
