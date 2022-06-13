const PORT_BACKEND = "5100";
const URL_DATABASE = "192.168.0.120";
const URL_PROTOCOL = "http";
const URL_BACKEND = "192.168.0.120";
const pako = require("pako");
const DEFAULT_POST_HEADER = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ cantidad: 0 }),
};

const Status = {
  normal: {
    title: "Normal",
    icon: "faThumbsUp",
    coment: "ok ",
    key: "normal",
    print: function () {
      return this.title;
    },
  },
  delete: {
    title: "Borrar",
    icon: "faTrashAlt",
    coment: "para Borrar",
    key: "delete",
    print: function () {
      return this.title;
    },
  },
  spam: {
    title: "Spam",
    icon: "faPastafarianism",
    coment: "spam",
    key: "spam",
    print: function () {
      return this.title;
    },
  },
  reenviar: {
    title: "Reenviar",
    icon: "faMailBulk",
    coment: "Reenviar a..",
    key: "reenviar",
    print: function () {
      return this.title;
    },
  },
  leido: {
    title: "leido",
    icon: "faEnvelopeOpen",
    comment: "marcado como leido",
    key: "leido",
    print: function () {
      return this.title;
    },
  },
  ignorar: {
    title: "Ignorar",
    icon: "faMailBulk",
    coment: "Ignorar",
    key: "ignorar",
    print: function () {
      return this.title;
    },
  },
  reenviado: {
    title: "Reenviado",
    to: null,
    icon: "faReply  ",
    coment: "Reenviado",
    key: "reenviado",
    print: function () {
      return this.title;
    },
  },
};
const onRetrieveUrl = async (url, options, callback) => {
  console.log(`url=${url}`);
  const rawResponse = await fetch(url, options);
  const content = await rawResponse.json();
  return callback(content);
};

const getSentEmails = (credenciales) => {
  console.log(`getSentEmails ---->${credenciales}`);
  return onRetrieveUrl2(
    `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/getSentEmailForUser`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credenciales }),
    }
  );
};

const onRetrieveUrl2 = async (url, options) => {
  console.log(`url=${url}`);
  const rawResponse = await fetch(url, options);
  const content = await rawResponse.json();
  return content;
};

const getDataAdreesBook = async (page, callback) => {
  console.log("getDataAdreesBook");
  let header = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  /*   function compressBody(body) {
    return new Promise(function (resolve, reject) {
      zlib.deflate(body, (err, buffer) => {
        if (err) {
          console.log("Error Zipping");
          reject(err);
        }
        console.log("Zipped");

        resolve(buffer);
      });
    });
  } */

  let url = `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/getAddressBook?page=${page}`;
  console.log(url);
  onRetrieveUrl(url, header, callback);
};

const sendEmailToDb = (credenciales, email, callback) => {
  console.log(`constants=>sendEmailToDb`);

  try {
    let stringtogzip = JSON.stringify({ credenciales, email });
    if (typeof stringtogzip === "string") console.log("es String stringtozip");
    console.log(`largo:${stringtogzip.length} ${stringtogzip}`);
    /* gzip devuelve object  */
    let gZipString = pako.gzip(stringtogzip, { to: "string" });

    if (typeof gZipString === "string") {
      console.log(`Es String largo:${gZipString.length} es:${gZipString}`);
    } else {
      console.log(typeof gZipString);
      console.log(`Es Object ${JSON.stringify(gZipString)}`);
      console.log(`${typeof JSON.stringify(gZipString)}`);
    }
    
    let stringBody = JSON.stringify(gZipString);
    console.log(stringBody.length);
    onRetrieveUrl(
      `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/sendEmailToDb`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //    "Content-Encoding": "gzip",
          // "Content-Length": stringBody.byteLength,
        },
        body: JSON.stringify({ credenciales, email }),
      },
      (data, err) => {
        callback(data, err);
      }

    );
  } catch (error) {
    console.error(error);
  }
};

const retrieveAllFromDb = async (callback) => {
  onRetrieveUrl(
    `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/updateEmailFromDb`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cantidad: 0 }),
    },
    (data, err) => {
      return callback(data, err);
    }
  );
};

const printMail = (mail) => {
  console.log(JSON.stringify({ ...mail, html: "" }, null, 2));
};

const makeReduce = (arrayBuffer) => {
  return window.btoa(
    new Uint8Array(arrayBuffer).reduce(function (data, byte) {
      return data + String.fromCharCode(byte);
    }, "")
  );
};

const getStyleForState = (email) => {
  const { state, leido } = email;
  if (leido) {
    return "#1f11";
  }

  switch (state) {
    case "reenviado":
      return "#ffc107";

    case "normal":
      return "#79dd79";

    case "spam":
      return "#ef6868";

    default:
      return "white";
  }
};

module.exports = {
  PORT_BACKEND,
  URL_DATABASE,
  URL_PROTOCOL,
  DEFAULT_POST_HEADER,
  Status,
  makeReduce,
  onRetrieveUrl,
  sendEmailToDb,
  retrieveAllFromDb,
  getSentEmails,
  onRetrieveUrl2,
  getDataAdreesBook,
  getStyleForState,
  printMail,
};
