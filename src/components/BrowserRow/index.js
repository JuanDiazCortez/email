import React, { Fragment, useState, useContext } from "react";
import {
  getIconFromName,
  searchStatus,
  getBorderForState,
  onClickDownLoadAttach,
  isIMG
} from "./BrowserRowHooks";

import { faEnvelopeOpen, faPaperclip } from "@fortawesome/free-solid-svg-icons";

import shortid from "shortid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "../styleRow.js";
import { Status, printMail, getStyleForState } from "../constants";
import { useHref } from "react-router-dom";
import EmailContext from "../Context/EmailContext";
import SelectEmailContext from "../Context/SelectEmailContext";
import "./browserRow.css";

const medium = "text-md-start fs-4"; // medium
const large = "text-lg-start"; // large

const RenderAttachs = ({ email }) => {
  const [showAttach, setShowAttach] = useState(false);
  const { attachments } = email;
  // console.log(attachments);
  const handleClickAttach = (ev) => {
    console.log("handleClickAttach");
    setShowAttach(!showAttach);
  };
  return (
    <div>
      {attachments && (
        <div>
          <FontAwesomeIcon
            icon={faPaperclip}
            onClick={handleClickAttach}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="clik para ver attach"
          />

          {showAttach && (
            <ul
              className="list-unstyled"
              style={{
                overflowY: attachments.length > 2 ? "scroll" : "auto",
                maxHeight: "10rem",
                maxWidth: "22rem",
                overflowX: "auto"
              }}
            >
              {attachments.map(
                (attach) =>
                  isIMG(attach) && (
                    <li
                      className="fs-5"
                      key={shortid.generate()}
                      style={{
                        fontSize: medium,
                        fontWeight: !email.leido ? "bold" : "nornal"
                      }}
                    >
                      <div>
                        <a
                          href="#"
                          onClick={(ev) => {
                            onClickDownLoadAttach(ev, attach);
                          }}
                          data-bs-toggle="tooltip"
                          data-bs-placement="bottom"
                          title="Click para bajar attach"
                        >
                          {attach.fileName}
                        </a>
                      </div>
                    </li>
                  )
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const BrowserRow = ({
  email,
  isRowForShow,
  onClickRow,
  onSelectMenu,
  credenciales,
  changeRow
}) => {
  const [hover, setHover] = useState(false);
  const [showList, setShowList] = useState([]);
  const { data, setData } = useContext(EmailContext);
  const { selectedRows, setSelectedRows } = useContext(SelectEmailContext);

  const isSelected = (email) => {
    if (selectedRows.length === 0) return false;
    return selectedRows.find(
      (eachEmail) => eachEmail.messageId === email.messageId
    );
  };

  const addToSelect = (ev, mail) => {
    console.log("addToSelect");
    // printMail(mail);
    /* si esta en selected rows */
    let found = selectedRows.find(
      (eachMail) => eachMail.messageId === mail.messageId
    );
    if (found) {
      console.log("found");
      /* lo quita */
      setSelectedRows(
        selectedRows.filter((eachMail) => eachMail.messageId !== mail.messageId)
      );
    } else {
      /* lo agrega */
      console.log("!found");
      setSelectedRows([...selectedRows, mail]);
    }
  };

  return isRowForShow ? (
    <React.Fragment>
      <tr
        key={`key-tr-${email.messageId}`}
        id={`id-tr-${email.messageId}`}
        className={`table-row fs-4 ${getBorderForState(email.state)}`}
        style={{ backgroundColor: getStyleForState(email) }}
        tabIndex="0"
      >
        <td key={shortid.generate()} className="table-row">
          <input
            type="checkbox"
            onChange={(ev) => addToSelect(ev, email)}
            defaultChecked={isSelected(email)}
          />
        </td>
        <td key={shortid.generate()}>
          <RenderAttachs email={email} />
        </td>
        <td
          className="table-row"
          key={shortid.generate()}
          onDoubleClick={(ev) => {
            onClickRow(ev, email);
          }}
        >
          <div>
            <select
              className="fs-4"
              onChange={(ev) => {
                onSelectMenu(ev, email, data, setData, credenciales);
              }}
              style={{
                ...style.normal,
                ...(hover ? style.hover : null),
                borderRadius: "10%"
              }}
            >
              <option>Menu</option>
              <option key={shortid.generate()} value="reenviar">
                Reenviar a
              </option>
              <option key={shortid.generate()} value="leido">
                Marcar leido
              </option>
              <option key={shortid.generate()} value="delete">
                Eliminar
              </option>
              <option key={shortid.generate()} value="spam">
                Marcas Spam
              </option>
              <option key={shortid.generate()} value="ignorar">
                Ignorar
              </option>
            </select>
          </div>
        </td>
        <td
          className="table-row"
          tabIndex="0"
          key={shortid.generate()}
          id={`id-td-${email.messageId}`}
          onDoubleClick={(ev) => {
            onClickRow(ev, email);
          }}
          type="icon"
        >
          <div id="id-state">
            <FontAwesomeIcon
              icon={
                email.leido
                  ? faEnvelopeOpen
                  : getIconFromName(Status[email.state].icon)
              }
            />

            <div
              className={medium + " border border-3"}
              key={shortid.generate()}
              style={{
                fontSize: medium,
                fontWeight: !email.leido ? "bold" : "nornal"
              }}
            >
              <div
                key={shortid.generate()}
                className="mt-0"
                style={{ backgroundColor: getStyleForState(email) }}
              >
                {searchStatus(email).map((st) => (
                  <div className="mt-0" key={shortid.generate()}>
                    {
                      <p
                        className="pp1"
                        key={shortid.generate()}
                        style={{
                          marginTop: "0px",
                          marginBottom: "0px",
                          fontSize: "12px"
                        }}
                      >
                        {st}
                      </p>
                    }
                  </div>
                ))}
              </div>
            </div>
            {email.reenviado ? (
              <React.Fragment>
                <p className="fw-bold">{email.reenviado.nombre}</p>
                <p className="fs-4 fw-bold">{email.reenviado.email}</p>
                <p className="fs-4 fw-bold">
                  {new Date(email.reenviado_fecha).toLocaleDateString("es-AR")}
                </p>
              </React.Fragment>
            ) : null}
          </div>
        </td>
        <td
          className="table-row"
          key={shortid.generate()}
          type="row"
          onDoubleClick={(ev) => {
            onClickRow(ev, email);
          }}
        >
          <span className="bA4">
            <span>
              <div
                className={medium}
                style={{
                  fontSize: medium,
                  fontWeight: !email.leido ? "bold" : "nornal"
                }}
              >
                {email.from[0].address}
                {email.from[0].name}
              </div>
            </span>
          </span>
        </td>
        <td key={shortid.generate()} className="table-row">
          <span className="span">
            <span data-hovercard-owner-id={email.messageId}>
              <p
                className={medium}
                type="row"
                style={{
                  fontSize: medium,
                  fontWeight: !email.leido ? "bold" : "nornal"
                }}
              >
                {`${new Date(email.receivedDate).toLocaleDateString(
                  navigator.language
                )}  ${new Date(email.receivedDate).toLocaleTimeString("es-AR", {
                  hour12: false
                })}`}
              </p>
            </span>
          </span>
        </td>

        <td
          key={shortid.generate()}
          className="table-row"
          style={{ height: "9rem", overflow: "auto" }}
          onClick={(ev) => {
            changeRow(email);
          }}
        >
          <div className="d-flex flex-row w-100">
            <span className="bA4">
              <span
                translate="no"
                className={medium}
                type="row"
                data-hovercard-owner-id={email.messageId}
                style={{
                  fontWeight: !email.leido ? "bold" : "nornal"
                }}
              >
                {email.subject}
              </span>
            </span>
          </div>
        </td>

        <td key={shortid.generate()} className="table-row">
          <div
            className="d-flex flex-row "
            style={{ maxHeight: "9rem", overflow: "auto" }}
          >
            <div
              translate="no"
              className={medium + " scrollable-bar"}
              type="row"
              data-hovercard-owner-id={email.messageId}
              style={{
                fontWeight: !email.leido ? "bold" : "nornal"
              }}
            >
              {email.text ? email.text.substring(0, 300) : ""}
            </div>
          </div>
        </td>
      </tr>
    </React.Fragment>
  ) : null;
};

export default BrowserRow;