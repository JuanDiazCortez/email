import React, { Fragment, useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";

import shortid from "shortid";
import BrowserRow from "../BrowserRow";
import {
  updateReenviado,
  onListFilter,
  processChange,
} from "./BrowserEmailHelpers";
// import FilterForStatus from "../FilterForStatus";
import ModalEditor from "../ModalEditor";
import SendMail from "../SendMail";
import style from "../styleRow";
import {
  faExclamationCircle,
  faTrashAlt,
  faEnvelopeOpen,
  faArrowDown,
  faPaperclip,
  faSyncAlt,
  faReply,
  faReplyAll,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";

import {
  URL_DATABASE,
  PORT_BACKEND,
  Status,
  onRetrieveUrl,
  // pritMail
} from "../constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./browser.css";

// import EmailContext from "../Context/EmailContext";
import SelectEmailContext from "../Context/SelectEmailContext";
// const small = "fs2";

function BrowserEmail({
  data,
  setData,
  vista,
  credenciales,
  setShowDetail,
  setPushedRow,
  pushedRow,
  setDetail,
  setVolver,
  loadDataRows,
  showModal,
  setShowModal,
  setChangeFlag,
  setIdUserReenviar,
  userReenviado,
  changeRow,
  loading,
}) {
  const [showFilter, setshowFilter] = useState(false);
  const [filterTodos, setfilterTodos] = useState(true);
  const [filterLeidos, setFilterLeidos] = useState(false);
  const [filterNoLeidos, setFilterNoLeidos] = useState(false);
  const [filterReenviados, setFilterReenviados] = useState(false);

  const [showModalEmail, setShowModalEmail] = useState(false);

  const [textoEmail, setTextoEmail] = useState("");

  const [hover, setHover] = useState(false);
  //  const [hoverDestino, setHoverDestino] = useState(false);

  const [y, setY] = useState();
  const [showRef, setShowRef] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [filterOption, setFilterOption] = useState("texto");
  const [reenviadoModel, setReenviadoModel] = useState(null);
  const [idModal, setIdModal] = useState(null);
  //console.log(data);

  const { selectedRows, setSelectedRows } = useContext(SelectEmailContext);

  let email = selectedRows.length === 0 ? null : selectedRows[0];

  // component didmount
  useEffect(() => {
    console.log("component bRowserMain mount");
    if (pushedRow) {
      console.log("pushed hay que volver");
      console.log(`id-td-${pushedRow}`);
      let target = document.getElementById(`id-td-${pushedRow}`);
      if (target) {
        console.log("target existe");
        target.focus({ preventScroll: false });
      } else console.log("no volver ");
      console.log("nulling");
      setPushedRow(null);
    }
  }, []);

  const renderChanged = (id, email) => {
    console.log(id);

    ReactDOM.render(
      <BrowserRow
        isRowForShow={isRowForShow(email)}
        email={email}
        onClickRow={onClickRow}
        selectedRows={selectedRows}
        onRetrieveUrl={onRetrieveUrl}
        onSelectMenu={onSelectMenu}
        credenciales={credenciales}
      />,
      id
    );

    return true;
  };

  useEffect(() => {
    console.log("usereffect []");
    if (userReenviado) {
      console.log(`User fue reenviado ${JSON.stringify(userReenviado)}`);
      updateReenviado(userReenviado, credenciales, setData, data);
    }
  }, [userReenviado]);

  const onSelectMenu = (ev, mail) => {
    //   console.log(`onselectmenu ${mail}`);
    console.log(`select ${ev.target.value}  para -->  ${mail.subject}`);
    /* es reenviar y no tiene dato seleccionado abre el modal. */
    if (ev.target.value === "reenviar" && idModal === null) {
      if (reenviadoModel === null) {
        setIdUserReenviar(mail);
        return setShowModal(true);
      }
    }
    // console.log(credenciales);
    const newMail = {
      id_generador: credenciales.id, //  credenciales.result.id, //id del generador del cambio de status
      id: mail.messageId,
      newStatus: ev.target.value,
      leido: !mail.leido,
      mail: mail.messageId,
    };
    onRetrieveUrl(
      `http://${URL_DATABASE}:${PORT_BACKEND}/changeStatus`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMail),
      },
      function (content) {
        processChange(content, ev, mail, data, setData, newMail, setChangeFlag);
      }
    );
  };

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const onResponderClick = (ev, tittle) => {
    // console.log("onResponderClick");
    setTextoEmail(tittle);
    setShowModalEmail(!showModalEmail);
  };

  const onClickSelTodos = () => {
    let selected = [];
    let newList = data.map((item) => {
      if (selectedRows.indexOf(item) === -1) selected.push(item);
      else selected.filter((email) => email === item);
    });
    setSelectedRows(selected);
  };

  const isWithThisOrigen = (mail, origen) => {
    console.log(mail.from);
    return mail.from.filter((correo) => correo.address == origen).length > 0;
  };

  const onClickFiltrar = (ev) => {
    console.log("on click filtrar" + ev.target);
    console.log(` filterOption=${filterOption} filterText=${filterText}`);
    if (filterOption && filterOption === "") {
      /* filtrar por input */
    }

    if (filterOption === "origen" && filterText !== "") {
      console.log("filte  x origen");
      /* filtrar por origen */
      //  let c = await onClickButton(ev, 20);
      /* recover all data then filter*/
      let result = data.filter((mail) => isWithThisOrigen(mail, filterText));
      console.log(result);
      setData(result);
    }

    if (filterOption === "subject" && filterText !== "") {
      console.log("filter x subject");
      let result = [];
      data.map((mail) => {
        if (mail.text) {
          if (
            mail.subject.toUpperCase().indexOf(filterText.toUpperCase()) !== -1
          ) {
            result.push(mail);
          }
        }
      });
      setSelectedRows([]);
      setData(result);
    }

    if (filterOption === "text" && filterText !== "") {
      /* filtrar por destino */
      console.log("filtrar x text");
      let result = [];
      data.map((mail) => {
        if (mail.text) {
          if (
            mail.text.toUpperCase().indexOf(filterText.toUpperCase()) !== -1
          ) {
            result.push(mail);
          }
        }
      });
      setSelectedRows([]);
      setData(result);
    }
  };

  const handleNavigation = (e) => {
    // console.log("handle scroll");
    const window = e.currentTarget;
    if (y > window.scrollY) {
      //  console.log("scrolling up");
    } else if (y < window.scrollY) {
      //   console.log("scrolling down");
    }
    setY(window.scrollY);
    //    console.log(window.scrollY);
    if (window.scrollY > 162) {
      // let t = document.getElementById("side-toolbar");
      // let offset = t.offsetTop;
      // // let w = $(window);
      // let x = offset.left;
      // t.css("left", x + 50);
    }
    /* let n = new DOMRect(t.x, t.y - window.scrollY, t.width, t.height);
    document.getElementById("side-toolbar").setBoundingClientRect = n; */
  };

  useEffect(() => {
    if (filterLeidos) {
      console.log("leidos true");
      setfilterTodos(false);
      setFilterNoLeidos(false);
    }

    if (filterNoLeidos) {
      console.log("No leidos true");
      setfilterTodos(false);
      if (filterTodos) {
        console.log("todos true");
        setFilterReenviados(false);
        setFilterNoLeidos(false);
        setFilterLeidos(false);
      }
    }
    if (filterTodos) {
      console.log("todos true");
      setFilterReenviados(false);
      setFilterNoLeidos(false);
      setFilterLeidos(false);
    }
    if (filterReenviados) {
      console.log("reenviados true");
      setFilterNoLeidos(false);
      setFilterLeidos(false);
    }
  }, [filterLeidos, filterTodos, filterNoLeidos, filterReenviados]);

  const onDeleteClick = (ev, mail) => {
    console.log("onDeleteClick");
    if (selectedRows.length === 0) return false;

    let newList = data.map((item) => {
      let found = selectedRows.find((el) => el.messageId === item.messageId);
      if (found) {
        const updateItem = { ...item, state: Status.delete.key };
        return updateItem;
      }
      return item;
    });
    setSelectedRows([]);
    setData(newList);
  };

  const onSpamClick = (ev) => {
    console.log("onSpamClick");
    if (selectedRows.length === 0) return false;

    let newList = data.map((item) => {
      let found = selectedRows.find((el) => el.messageId === item.messageId);
      if (found) {
        const updateItem = { ...item, state: Status.spam.key };
        return updateItem;
      }
      return item;
    });
    setSelectedRows([]);
    setData(newList);
  };

  const onNotFilterClick = (ev) => {
    loadDataRows();
    setFilterText("");
  };

  const onFilterWithAttachClick = (ev) => {
    console.log("filter attach");
    let newList = data.filter(
      (item) => item.attachments && item.attachments.length > 0
    );
    setData(newList);
  };

  const onOpenClick = (ev) => {
    console.log("openClick");
    console.log(ev.curentTarget);

    if (selectedRows.length === 0) return false;
    console.log(selectedRows);

    let newList = data.map((item) => {
      let found = selectedRows.find((el) => el.messageId === item.messageId);
      if (found) {
        const updateItem = { ...item, leido: true };
        return updateItem;
      }
      return item;
    });
    setSelectedRows([]);
    setData(newList);
  };

  const onClickRow = (ev, mail) => {
    console.log(mail);
    console.log(ev.target.type);
    if (ev.target.type !== "select-one" && ev.target.type !== "checkbox") {
      console.dir(`click on Row `);
      //  console.log(document.getElementById(`id-td-${mail.messageId}`));
      setPushedRow(mail.messageId);
      //
      setDetail(mail);
      setVolver(false);
      setShowDetail(true);
    }
  };

  const toolbarStyle = {
    marginLeft: "1rem",
  };

  const medium = "text-md-start"; // medium
  const large = "text-lg-start"; // large

  const isRowForShow = (email) => {
    /* leido not show in gral */
    if (email === null || email === undefined ) return false;
    if (vista === "G" && email.leido) {
      return false;
    }
    if (filterTodos) return true;
    if (filterLeidos && email.leido) return true;
    if (filterReenviados) return true;
    if (filterNoLeidos && !email.leido) return true;
    return false;
  };

  const ButtonMail = ({ icon, texto, clickHandle }) => {
    return (
      <div
        className="button"
        style={{
          display: "flex",
          flexDirection: "column",
          border: "2px",
          borderColor: "white",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        onClick={clickHandle}
      >
        <FontAwesomeIcon
          className="fa fa-bars ml-4 button"
          role="button"
          type="filter_todos"
          onClick={clickHandle}
          icon={icon}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={texto}
        />
        <p style={{ fontSize: "smaller" }}> {texto}</p>
      </div>
    );
  };

  const TableHeaderTool = () => {
    return (
      <div id="tabletool-div" className="d-flex flex-row h-15 position-sticky">
        <div className="ml-4" style={toolbarStyle}>
          <FontAwesomeIcon
            onClick={(ev) => setshowFilter(!showFilter)}
            className="fa-2 ml-4 button"
            data-toggle="tooltip"
            title="Borrar"
            role="button"
            icon={faArrowDown}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />
          {showFilter ? (
            <div>
              <ul className="list-unstyled list-group-item">
                <li
                  key={shortid.generate()}
                  className="list-item"
                  onClick={(ev) => setfilterTodos(true)}
                  onMouseEnter={() => {
                    setHover(true);
                  }}
                  onMouseLeave={() => {
                    setHover(false);
                  }}
                  style={{
                    "&:hover": {
                      background: "#efefef",
                    },
                    "&:lastChild": {
                      borderRight: "solid 1px #cccccc",
                    },
                  }}
                >
                  <a
                    className=" fa-5 list-item text-decoration-none"
                    key={shortid.generate()}
                  >
                    Todos
                  </a>
                </li>
                <li
                  key={shortid.generate()}
                  onClick={(ev) => setFilterLeidos(true)}
                  className="list-item"
                  onMouseEnter={() => {
                    setHover(true);
                  }}
                  onMouseLeave={() => {
                    setHover(false);
                  }}
                  style={{
                    ...style.normal,
                    ...(hover ? style.hover : null),
                  }}
                >
                  <a
                    className="fa-5 list-item text-decoration-none"
                    key={shortid.generate()}
                  >
                    Leidos
                  </a>
                </li>
                <li
                  onClick={(ev) => setFilterNoLeidos(true)}
                  key={shortid.generate()}
                  className="list-item"
                  onMouseEnter={() => {
                    setHover(true);
                  }}
                  onMouseLeave={() => {
                    setHover(false);
                  }}
                  style={{
                    ...style.normal,
                    ...(hover ? style.hover : null),
                  }}
                >
                  <a
                    className="fa-5 list-item text-decoration-none"
                    key={shortid.generate()}
                  >
                    No Leidos
                  </a>
                </li>

                <li
                  onClick={(ev) => setFilterReenviados(true)}
                  key={shortid.generate()}
                  className="list-item"
                  onMouseEnter={() => {
                    setHover(true);
                  }}
                  onMouseLeave={() => {
                    setHover(false);
                  }}
                  style={{
                    ...style.normal,
                    ...(hover ? style.hover : null),
                  }}
                >
                  <a
                    className="fa-5 list-item text-decoration-none"
                    key={shortid.generate()}
                  >
                    Reenviados
                  </a>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
        <div className="d-flex flex-row  ">
          <div className="ml-4" style={toolbarStyle}>
            <FontAwesomeIcon
              className="fa-2 ml-4 button"
              role="button"
              type="marcar_borrrar"
              value="marcar_borrrar"
              onClick={(ev, mail) => onDeleteClick(ev, mail)}
              icon={faTrashAlt}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Marcar borrar"
            />
          </div>
          <span className="border-0"></span>
          <div className="ml-4" style={toolbarStyle}>
            <FontAwesomeIcon
              className="fa-2 ml-4 button"
              role="button"
              type="marcar_spam"
              value="marcar_spam"
              onClick={(ev) => onSpamClick(ev)}
              icon={faExclamationCircle}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Marcar Spam"
            />
          </div>
          <div className="ml-4" style={toolbarStyle}>
            <FontAwesomeIcon
              className="fa-2 ml-4 button"
              role="button"
              type="marcar_leido"
              value="marcar_leido"
              onClick={(ev) => onOpenClick(ev)}
              icon={faEnvelopeOpen}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Marcar leido"
            />
          </div>

          <div className="ml-4" style={toolbarStyle}>
            <FontAwesomeIcon
              className="fa-2 ml-4 button"
              role="button"
              type="filter_leido"
              onClick={(ev) => onFilterWithAttachClick(ev)}
              icon={faPaperclip}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="filtrar con Attach"
            />
          </div>

          <div className="ml-4" style={toolbarStyle}>
            <FontAwesomeIcon
              className="fa-2 ml-4 button"
              role="button"
              type="filter_todos"
              onClick={(ev) => onNotFilterClick(ev)}
              icon={faSyncAlt}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="todos"
            />
          </div>

          <div
            className="ml-4"
            style={{
              marginLeft: "1rem",
              display: "flex",
              flexDirection: "row",
              backgroundColor: "darkgrey",
              alignItems: "center",
              width: "22rem",
              justifyContent: "space-around",
              border: "2px",
              borderColor: "black",
              borderWidth: "1px",
              borderStyle: "solid",
              marginTop: "1px",
            }}
          >
            <ButtonMail
              id="buton-responder"
              icon={faReply}
              texto="Responder"
              clickHandle={(ev) => {
                onResponderClick(ev, "Responder Email");
              }}
            />

            <ButtonMail
              id="buton-reenviar"
              icon={faReplyAll}
              texto="reenviar"
              clickHandle={(ev) => {
                onResponderClick(ev, "Reenviar Email");
              }}
            />

            <ButtonMail
              id="buton-reenviar-todos"
              icon={faRepeat}
              texto="Reenviar Todos"
              clickHandle={(ev) => {
                onResponderClick(ev, "Responder a Todos");
              }}
            />
          </div>

          <div className="ms-4 dropdown rounded-start">
            <button
              className="btn btn-primary  dropdown-toggle fs-4"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="true"
              style={{ margin: 0 }}
            >
              Opciones de Filtrado
            </button>
            <ul
              key={shortid.generate()}
              className="dropdown-menu ml-0"
              aria-labelledby="dropdownMenuButton1"
              onChange={(ev) => {
                onListFilter(
                  ev,
                  setFilterText,
                  setFilterOption,
                  data,
                  setFilterList
                );
              }}
              style={{ margin: 0 }}
            >
              <li className="dropdown-item fs-4" key={shortid.generate()}>
                <a
                  key={shortid.generate()}
                  className="dropdown-item fs-4"
                  onClick={(ev) => {
                    onListFilter(
                      "origen",
                      setFilterText,
                      setFilterOption,
                      data,
                      setFilterList
                    );
                  }}
                >
                  Origen
                </a>
              </li>
              <li className="dropdown-item" key={shortid.generate()}>
                <a
                  className="dropdown-item fs-4"
                  key={shortid.generate()}
                  onClick={(ev) => {
                    onListFilter(
                      "destino",
                      setFilterText,
                      setFilterOption,
                      data,
                      setFilterList
                    );
                  }}
                >
                  Destino
                </a>
              </li>
              <li className="dropdown-item" key={shortid.generate()}>
                <a
                  className="dropdown-item fs-4"
                  key={shortid.generate()}
                  onClick={(ev) => {
                    onListFilter(
                      "subject",
                      setFilterText,
                      setFilterOption,
                      data,
                      setFilterList
                    );
                  }}
                >
                  subject
                </a>
              </li>
              <li className="dropdown-item" key={shortid.generate()}>
                <a
                  className="dropdown-item fs-4"
                  key={shortid.generate()}
                  onClick={(ev) => {
                    onListFilter(
                      "text",
                      setFilterText,
                      setFilterOption,
                      data,
                      setFilterList
                    );
                  }}
                >
                  Texto
                </a>
              </li>
            </ul>
          </div>

          <div className="d-flex flex-column">
            <input
              className="fs-4 form-control"
              type="text"
              role="input"
              id="filter"
              value={filterText}
              placeholder={`Busqueda x ${filterOption}`}
              onChange={(ev) => setFilterText(ev.target.value)}
              style={{
                width: "40rem",
                marginLeft: "4rem",
              }}
            />

            {filterList.length > 0 ? (
              <div className="list-group mt-4 text-secondary">
                <ul
                  id="lista-filter"
                  key={shortid.generate()}
                  className="text-secondary list-group-item list-group-item-action active"
                  aria-current="true"
                  style={{
                    "&:hover": {
                      background: "white#cadetblue",
                    },
                    "&:last-child": {
                      borderRight: "solid 1px #cccccc",
                    },
                  }}
                >
                  {filterList.map((item) => (
                    <li
                      className="list-group-item list-group-item-action  list-group-item-secondary  fs-4"
                      key={shortid.generate()}
                      onClick={(ev) => {
                        setFilterText(ev.target.textContent);
                        setFilterList([]);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <i
            id="id-button-filtrar"
            className="me-3 fa fa-search fa-2x me-md-3 "
            role="button"
            aria-hidden="true"
            onClick={(ev) => onClickFiltrar(ev)}
            style={{ marginLeft: "1rem" }}
          ></i>
          {/* </div> */}
        </div>
      </div>
    );
  };

  const showReferences = (email) => {
    if (email.references && email.references.length > 0) return true;
    if (email.attachments && email.attachments.length > 0) return true;
    return false;
  };
  const handleCloseModal = () => {
    setShowModalEmail(false);
    setChangeFlag(true);
  };
  return (
    <Fragment>
      <TableHeaderTool
        id="id-tool"
        style={{
          borderRightStyle: "dashed",
          position: "fixed",
          position: "sticky",
          top: "0",
        }}
      />

      <div
        className="browser-email"
        id="browser-email"
        style={{
          overflow: "scroll",
          maxHeight: "40rem",
        }}
      >
        {showModalEmail && (
          <ModalEditor
            onClose={handleCloseModal}
            windowClass="modale border border border-primary border-4 email"
          >
            <SendMail
              email={email}
              tittle={textoEmail}
              credenciales={credenciales}
              onClose={handleCloseModal}
              windowClass="modale border border border-primary border-4 email"
            />
          </ModalEditor>
        )}

        <table
          className="table table-ligth table-bordered border-solid"
          data-pagination="true"
          data-search="true"
        >
          <thead
            key={shortid.generate()}
            className="border-bottom fs-3"
            style={{
              borderRightStyle: "dashed",
              maxHeight: "20px",
              position: "sticky",
              top: "1",
            }}
          >
            <tr className="fs-4" style={{ backgroundColor: "#c7c7c7" }}>
              <th
                className="fs-4 "
                scope="col"
                role="button"
                onClick={(ev) => onClickSelTodos(ev)}
                style={{
                  width: "42px",
                  maxHeight: "20px",
                }}
              >
                Sel
              </th>
              <th scope="col" className="fs-3 ">
                <FontAwesomeIcon icon={faPaperclip} />
              </th>
              <th scope="col" className="fs-3 ">
                Action
              </th>
              <th scope="col" className="fs-3 ">
                Status
              </th>
              <th scope="col" className="fs-3 ">
                From
              </th>
              <th scope="col" className="fs-3 ">
                Fecha
              </th>
              <th scope="col" className="fs-3 ">
                Subject
              </th>
              <th scope="col" className="fs-3 ">
                Text
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map(
                (mail, index) =>
                  isRowForShow(mail) && (
                    <BrowserRow
                      key={shortid.generate()}
                      isRowForShow={isRowForShow(mail)}
                      email={mail}
                      onClickRow={onClickRow}
                      selectedRows={selectedRows}
                      onRetrieveUrl={onRetrieveUrl}
                      onSelectMenu={onSelectMenu}
                      setShowRef={setShowRef}
                      changeRow={changeRow}
                    />
                  )
              )}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default BrowserEmail;
