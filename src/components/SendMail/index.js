import React, { useState, useContext, useEffect } from "react";
import SelectEmailContext from "../Context/SelectEmailContext";
import { Buffer } from "buffer";
import shortid from "shortid";
import MyEditor from "../MyEditor";
import { faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./sendmail.css";
const {
  sendEmailToDb,
  getDataAdreesBook,
  getText,
  printMail,
} = require("../constants");
const pako = require("pako");

// const zlib = require("zlib");

const __MODULE_FILE__ = "SendMail.js";

function SendMail({ email, tittle, windowClass, credenciales, onClose }) {
  if (!email.messageId)
    console.log(`No tiene MessageId --> sendMail-> ${JSON.stringify(email)}`);

  //   const [showAddressBookList, setShowAddressBookList] = useState(false);
  const [fromValues, setToFromValues] = useState([
    { id: shortid.generate(), address: "" },
  ]);

  const [ccValues, setccValues] = useState([
    { id: shortid.generate(), address: "" },
  ]);

  const [subjectValue, setSubjectValue] = useState(email.subject);
  const [addressBook, setAddresBook] = useState([]);
  const { selectedRows } = useContext(SelectEmailContext);
  const [textContent, settextContent] = useState(getText());
  const [showHelp, setShowHelp] = useState(false);

  const [showFrom, setShowFrom] = useState(true);

  useEffect(() => {
    console.log(`sendMail->useefeectmail`);
    //  printMail(email);
    if (tittle === "Responder Email") {
      let to = email.from[0].address;

      console.log(`email from mount Responder ${JSON.stringify(to, null, 2)}`);
      setToFromValues([{ id: shortid.generate(), address: to }]);
    }

    if (tittle === "Responder a Todos") {
      let to = email.from;

      console.log(`email from mount Todos ${JSON.stringify(to, null, 2)}`);
      setToFromValues(to);
    }
  }, []);

  console.log(fromValues);
  useEffect(() => {
    console.log(`compomentDidMount-->${__MODULE_FILE__}`);
    //     email.from.map((elem) => setToValues[toValues.push(elem.address)]);

    const loadBooks = async () => {
      getDataAdreesBook(0, (books) => {
        console.log(books);
        setAddresBook(books);
      });
    };
    if (addressBook.length === 0) loadBooks();

    return () => {
      //  console.log(`compomentUnmount-->SendMail ${__MODULE_FILE__}`);
    };
  }, [addressBook]);

  // console.log(`selectedRows ${JSON.stringify(selectedRows, null, 2)}`);
  if (selectedRows.length === 0) {
    return alert("no seleccion?? correo a responder");
  } else {
    // email = selectedRows[0];
    let { subject, from } = email;

    //  console.log(subject);

    //    from.map((item) => console.log(item.address));
  }

  const handleSend = (ev) => {
    ev.preventDefault();

    let _mail;
    console.log(
      `ev.target.textContent ${ev.target.textContent} tittle ${textContent}`
    );

    console.log(tittle);

    if (tittle === "Responder Email") {
      _mail = {
        subject: subjectValue,
        messageId: email.messageId,
        from: "info@richelet.com.ar",
        to: fromValues,
        textContent: textContent,
        original: email.html,
        attachments: [],
        replyTo: email.messageId,
        sendAttach:
          email.attachments && email.attachments.length > 0 ? true : false,
      };
    }

    if (tittle === "Reenviar Email") {
      _mail = {
        subject: subjectValue,
        messageId: email.messageId,
        from: "info@richelet.com.ar",
        to: fromValues,
        textContent: textContent + email.html,
        original: email.html,
        attachments: [],
        sendAttach:
          email.attachments && email.attachments.length > 0 ? true : false,
      };
    }

    if (tittle === "Responder a Todos") {
      _mail = {
        subject: subjectValue,
        messageId: email.messageId,
        from: "info@richelet.com.ar",
        to: fromValues,
        textContent: textContent + email.html,
        original: email.html,
        attachments: [],
        sendAttach:
          email.attachments && email.attachments.length > 0 ? true : false,
      };
    }

    sendEmailToDb(
      credenciales,
      _mail,

      (data, err) => {
        if (err) {
          return console.error(err);
        }
        //   console.log(data);
        onClose();
      }
    );
  };

  const handleOnChangeSubject = (ev) => {
    setSubjectValue(ev.target.value);
  };
  const onChangeSubmit = (ev) => {
    ev.preventDefault();
    console.log("onChangeSubmit");
  };
  //

  const RendereBookList = ({ listBooks }) => {
    const [searchValue, setSearchValue] = useState("");
    const [listModel, setListModel] = useState([]);

    useEffect(() => {
      console.log(`compomentDidMount-->RenderBookList ${__MODULE_FILE__}`);
      let books = [];
      listBooks.map((book) => books.push(book));
      setListModel(books);
      return () => {
        console.log(`compomentUnmount-->RenderBookList ${__MODULE_FILE__}`);
      };
    }, []);

    const handleClickBook = (ev, address) => {
      console.log(`handleClickBook ${address}`);
    };

    const onChangeFind = (ev) => {
      console.log(listBooks);
      setSearchValue(ev.target.value);
      let filter = listBooks.filter((book) =>
        book.adress.includes(ev.target.value)
      );
      console.log(filter);
      setListModel(filter);
    };

    return (
      <div
        id="id-window-modal-edit"
        className={windowClass}
        style={{
          width: "80rem",
          maxHeight: "42rem",
          overflow: "scroll",
        }}
      >
        <input
          type="text"
          value={searchValue}
          onChange={(ev) => {
            onChangeFind(ev);
          }}
        />
        <ul
          className="listbook-list"
          style={{
            background: "#efefef",
            width: "auto",
            overflowY: "hidden",
            hover: { background: "blue" },
            "&:hover": {
              background: "#efefef",
            },
            "&:lastChild": {
              borderRight: "solid 1px #cccccc",
            },
          }}
        >
          {listModel.map((item) => (
            <li
              className="list-unstyled listbook"
              key={shortid.generate()}
              onClick={(ev) => {
                handleClickBook(ev, item.adress);
              }}
              style={{
                background: "#efefef",
                width: "auto",
                overflowY: "hidden",
                hover: { background: "blue" },
                "&:hover": {
                  background: "#efefef",
                },
                "&:lastChild": {
                  borderRight: "solid 1px #cccccc",
                },
              }}
            >
              {item.adress}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const onChangeContent = (content) => {
    console.log(`content:${content}`);
    settextContent(content);
  };

  const handleAddAddress = (ev) => {
    console.log(`handleAddAddress-->${__MODULE_FILE__}`);
    ev.preventDefault();
    setToFromValues((antValues) => [
      ...antValues,
      { id: shortid.generate(), address: "" },
    ]);
  };
  // console.log(fromValues);

  const handleCcChanged = (ev, id) => {
    const newFrom = ev.target.value;

    setToFromValues((antFrom) =>
      antFrom.map((from) =>
        from.id === id ? { ...from, address: newFrom } : from
      )
    );
  };

  const handleInputIndexChanged = (ev, id) => {
    const newFrom = ev.target.value;

    setToFromValues((antFrom) =>
      antFrom.map((from) =>
        from.id === id ? { ...from, address: newFrom } : from
      )
    );
  };

  const handleRemoveCc = (id) => {
    setccValues((antValues) => antValues.filter((add) => add.id !== id));
  };

  const handleRemoveTo = (id) => {
    setToFromValues((antValues) => antValues.filter((add) => add.id !== id));
  };
  return (
    <div className="container">
      <h2 className="mt-0">{tittle}</h2>
      <hr />
      <form
        className="form"
        onSubmit={(ev) => {
          onChangeSubmit(ev);
        }}
      >
        <div>
          <label className="form-label">
            from: <span>info@richelet.com.ar</span>
          </label>
        </div>
        <p>to</p>
        <button
          onClick={(ev) => {
            setShowFrom(!showFrom);
          }}
        >
          {showFrom ? "-" : "+"}
        </button>
        {showFrom && (
          <div id="frame-from">
            <div className="d-flex flex-row">
              <div className="input-group mb-3">
                {fromValues.map((item) => (
                  <div key={item.id}>
                    <label>To:</label>
                    <input
                      key={item.id}
                      value={item.address}
                      onChange={(ev) => {
                        handleInputIndexChanged(ev, item.id);
                      }}
                    />
                    <button
                      onClick={(ev) => {
                        setShowHelp(!showHelp);
                      }}
                    >
                      ?
                    </button>
                    <button
                      onClick={(ev) => {
                        handleRemoveTo(item.id);
                      }}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button onClick={handleAddAddress}>+add</button>
                {showHelp && (
                  <RendereBookList
                    key={shortid.generate()}
                    listBooks={addressBook}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {/***********************************************/}
        <button>{showFrom ? "-" : "+"}</button>
        {showFrom && (
          <div id="frame-cc">
            <div className="d-flex flex-row">
              <div className="input-group mb-3">
                {ccValues.map((item) => (
                  <div key={item.id}>
                    <label>cc:</label>
                    <input
                      key={item.id}
                      value={item.address}
                      onChange={(ev) => {
                        handleCcChanged(ev, item.id);
                      }}
                    />
                    <button
                      onClick={(ev) => {
                        setShowHelp(!showHelp);
                      }}
                    >
                      ?
                    </button>
                    <button
                      onClick={(ev) => {
                        handleRemoveCc(item.id);
                      }}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button onClick={handleAddAddress}>+add</button>
                {showHelp && (
                  <RendereBookList
                    key={shortid.generate()}
                    listBooks={addressBook}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {/* *********************************************/}
        <div className="input-group-sm mb-3">
          <label className="form-label">
            Subject:
            <input
              className="form-control"
              type="text"
              value={subjectValue}
              placeholder="Subject "
              onChange={handleOnChangeSubject}
              style={{ width: "75rem" }}
            />
          </label>
        </div>
        <div className="input-group mb-3">
          <label className="form-label">
            Text:
            <hr />
            <div className="form-control">
              <MyEditor
                texto={
                  tittle === "Responder"
                    ? textContent
                    : tittle === "Responder a Todos"
                    ? ""
                    : email.html
                }
                onChangeContent={onChangeContent}
                style={{
                  marginTop: "2rem",
                }}
              />
            </div>
          </label>
        </div>
        <button
          onClick={(ev) => {
            handleSend(ev);
          }}
        >
          Enviar
          <FontAwesomeIcon icon={faReplyAll} />
        </button>
      </form>
    </div>
  );
}

export default SendMail;
