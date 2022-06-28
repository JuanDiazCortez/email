import React from "react";
import SelectEmailContext from "../Context/SelectEmailContext";
import EmailContext from "../Context/EmailContext";
import {
  faInbox,
  faEnvelopeOpen,
  faEnvelopeOpenText,
  faHandSparkles,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext, useEffect } from "react";
import shortid from "shortid";
import "./sideComponent.css";
import { updateSpam, updateReaded } from "./useSpam";
const { getSentEmails } = require("../constants");

function SideComponent({ setVista, credenciales, changedFlag, resetFlag }) {
  console.log(`SideComponent ${JSON.stringify(credenciales)}`);

  const { sentEmails, setSentEmails } = useContext(SelectEmailContext);
  const { sentOuterEmails, setOuterEmails } = useContext(SelectEmailContext);
  const { readedEmails, setReaderEmails } = useContext(SelectEmailContext);
  const { spam, setSpam } = useContext(SelectEmailContext);
  const { data } = useContext(EmailContext);

  const faIcon = (item) => `${item.icon}`;

  useEffect(() => {
    // updateReaded(setReaderEmails, credenciales);
  }, [changedFlag]);

  const drawSpam = () => {
    console.log("drawSpam");
    return <p>{spam.length}</p>;
  };

  const drawOuterEmails = () => {
    console.log("drawOuterEmails");
    return <p>{sentOuterEmails.length}</p>;
  };

  const drawSentEmails = () => {
    console.log("drawSentEmails");
    return <p>{sentEmails.length}</p>;
  };
  const drawInboxEmails = () => {
    return <p>{data.filter((mail) => !mail.leido).length}</p>;
  };
  const drawReadedEmails = () => {
    return <p>{readedEmails.length}</p>;
  };

  const updateSented = async () => {
    console.log("setSentEmails");
    let response = await getSentEmails(credenciales);
    console.log(`updateSented  ${JSON.stringify(response)}`);
    setSentEmails(response.result);
    resetFlag(false);
  };
  //

  useEffect(() => {
    console.log("Sidecomponent mount");
    updateReaded(setReaderEmails, credenciales);
    updateSpam(setSpam, credenciales);
    updateSented();
  }, []);
  /*    

*/
  const onChangeVista = (vista) => {
    setVista(vista);
  };

  return (
    <div id="sidebar" className="list-group d-flex flex-column">
      <ul
        id="side-toolbar"
        // fs-2  list-group-item list-group-item-action active
        className="list-unstyled list-group list-group-item list-group-item-dark"
        aria-current="true"
        role="menu"
        onChange={(ev) => {
          console.log("onChange");
        }}
      >
        {[
          {
            text: "Bandeja de Entrada",
            icon: faInbox,
            process: drawInboxEmails,
            onClick: function () {
              onChangeVista("G");
            },
          },
          {
            text: "Bandeja de Salida",
            icon: faEnvelope,
            process: drawOuterEmails,
            onClick: function () {
              onChangeVista("Z");
            },
          },

          {
            text: "Leidos",
            icon: faEnvelope,
            process: drawReadedEmails,
            onClick: function () {
              onChangeVista("L");
            },
          },
          {
            text: "Enviados",
            icon: faEnvelopeOpenText,
            process: drawSentEmails,
            onClick: function () {
              onChangeVista("E");
            },
          },
          {
            text: "Spam",
            icon: faHandSparkles,
            process: drawSpam,
            onClick: function () {
              onChangeVista("S");
            },
          },
        ].map((item, i) => (
          <li
            className="list-group-item list-group-item-secondary li-side "
            key={shortid.generate()}
            style={{
              height: "100%",
              backgroundColor: "#e2e3e5",
              width: "auto",
              overflowY: "hidden",
              "&:hover": {
                background: "#efefef",
              },
              "&:lastChild": {
                borderRight: "solid 1px #cccccc",
              },
            }}
            onClick={item.onClick}
            value={item.text}
          >
            <div className="d-flex container-lg ">
              <FontAwesomeIcon className="fa-2x ml-4 button" icon={item.icon} />
              <div
                className="separador"
                style={{
                  "&:hover": {
                    background: "#efefef",
                  },
                  "&:lastChild": {
                    borderRight: "solid 1px #cccccc",
                  },
                  width: "2rem",
                }}
              />
              <a id="side-menu" className="fs-4 ms-3 ml-2">
                {item.text}
                {item.process()}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideComponent;
