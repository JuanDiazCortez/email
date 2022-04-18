import React from "react";
import shortid from "shortid";
const { printMail } = require("./constants");

function EmailCard({ email }) {
  printMail(email);
  const onClickCerrar = (ev) => {
    let main = document.getElementById("id-main");
    let child = document.getElementById("id-main-modal");
    main.removeChild(child);
  };
  return (
    <div>
      <div>
        <h4>Subject: {email.subject}</h4>
        <ul>
          {[] ||
            email.attachments.map((attach) => (
              <li key={shortid.generate()}>
                <div className="d-flex flex-column">
                  <div>
                    <p>
                      FileName:
                      <a>
                        {attach.fileName
                          ? attach.generatedFileName
                          : attach.fileName}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p>Type:{attach.type}</p>
                  </div>
                  <div>
                    <p>Long:{attach.length}</p>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>

      <button onClick={(ev) => onClickCerrar(ev)}>Cerrar</button>
    </div>
  );
}

export default EmailCard;
