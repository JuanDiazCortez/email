import React, { useContext } from "react";
import BrowserEmail from "./BrowserEmail";
import { useState, useEffect } from "react";
import EmailComponent from "./EmailComponent";
import SideComponent from "./SideComponent";
import ModalUserSelect from "./ModalUsersSelect";
import EmailContext from "./Context/EmailContext";
import SelectEmailContext from "./Context/SelectEmailContext";

import Modal from "react-modal";
const __MODULE__ = "BrowserMain.js";
//
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function BrowserMain({
  volver,
  setVolver,
  onClickButton,
  credenciales,
  loading,
}) {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setdetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [userSelect, setUserSelect] = useState();
  const [idUserReenviar, setIdUserReenviar] = useState();
  const [userReenviado, setuserReenviado] = useState();
  const [pushedRow, setPushedRow] = useState(null);
  const [changedFlag, setChangeFlag] = useState(false);
  const [vista, setVista] = useState("G");
  const [dataRows, setDataRows] = useState([]);
  const { data } = useContext(EmailContext);
  const { readedEmails, setReaderEmails } = useContext(SelectEmailContext);
  const { spam } = useContext(SelectEmailContext);
  const { sentEmails } = useContext(SelectEmailContext);
  const [row, setRow] = useState(1);

  const loadDataRows = () => {
    let result = data.map((mail) => {
      if (!mail.leido) return mail;
    });
    setDataRows(result);
    setChangeFlag(true);
  };

  const loadSentedMails = () => {
    console.log("loadSentedMails");
    console.log(sentEmails);
    let result = sentEmails.map((mail) => {
      return mail;
    });
    setDataRows(result);
    setChangeFlag(true);
  };

  const loadSpamMails = () => {
    let result = spam.map((mail) => {
      return mail;
    });

    setDataRows(result);
    setChangeFlag(true);
  };

  const loadReadedMails = () => {
    let result = readedEmails.map((mail) => {
      return mail;
    });
    setDataRows(result);
    setChangeFlag(true);
  };
  useEffect(() => {
    console.log(`componentDidMount-->>${__MODULE__}`);
    if (row === 1) setRow(data[0]);
  });

  useEffect(() => {
    console.log(`MAIN->USEEFFERCT data ${vista}`);
    switch (vista) {
      case "G":
        loadDataRows();
        break;
      case "E":
        loadSentedMails();
        break;
      case "L":
        loadReadedMails();
        break;
      case "S":
        loadSpamMails();
        break;
      default:
        break;
    }
  }, [vista]);

  useEffect(() => {
    /* setea el prop userReenviado */
    if (userSelect) {
      setuserReenviado({
        id: idUserReenviar.messageId,
        leido: idUserReenviar.leido,
        toUser: userSelect,
      });
    }
  }, [userSelect]);

  useEffect(() => {
    if (volver) {
      setShowDetail(false);
    }
  }, [volver]);

  const onChangeRow = (email) => {
    console.log(`onChangeRow ${email.subject}`);
    setRow(email);
  };

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <div className="d-flex flex-row mt-3">
      <div
        className="menu-left"
        style={{
          minHeight: "20rem",
          minWidth: "18rem",
          borderLeft: "4px solid blue",
          overflow: "scroll",
        }}
      >
        <SideComponent
          setVista={setVista}
          mails={dataRows}
          credenciales={credenciales}
          changedFlag={changedFlag}
          resetFlag={setChangeFlag}
        />
      </div>

      <Modal
        isOpen={showModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <ModalUserSelect
          credenciales={credenciales}
          closeModal={closeModal}
          setUserSelect={setUserSelect}
        />
      </Modal>
      <div>
        {!showDetail && (
          <div horizontal minsecondarysize="15%">
            <BrowserEmail
              data={dataRows}
              setData={setDataRows}
              vista={vista}
              credenciales={credenciales}
              setShowDetail={setShowDetail}
              setDetail={setdetail}
              setVolver={setVolver}
              setPushedRow={setPushedRow}
              loadDataRows={loadDataRows}
              setChangeFlag={setChangeFlag}
              showModal={showModal}
              setShowModal={setShowModal}
              setIdUserReenviar={setIdUserReenviar}
              userReenviado={userReenviado}
              pushedRow={pushedRow}
              changeRow={onChangeRow}
              loading={loading}
            />
            {vista !== "E" && (
              <EmailComponent
                id="emailComponent"
                data={row}
                name={"border border-primary p-3 mb-2 bg-secondary text-white"}
              />
            )}
          </div>
        )}
        <div>
          {showDetail && (
            <div className="container">
              <EmailComponent data={detail} name={"container"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowserMain;
