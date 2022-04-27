/*
 */

var PORT_BACKEND = "5100";

const URL_DATABASE = "192.168.1.17";

var URL_PROTOCOL = "http";
const URL_BACKEND = "192.168.1.19";

const DEFAULT_POST_HEADER = {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ cantidad: 0 })
};


const Status = {
  normal: {
    title: "Normal",
    icon: "faThumbsUp",
    coment: "ok ",
    key: "normal",
    print: function () {
      return this.title;
    }
  },
  delete: {
    title: "Borrar",
    icon: "faTrashAlt",
    coment: "para Borrar",
    key: "delete",
    print: function () {
      return this.title;
    }
  },
  spam: {
    title: "Spam",
    icon: "faPastafarianism",
    coment: "spam",
    key: "spam",
    print: function () {
      return this.title;
    }
  },
  reenviar: {
    title: "Reenviar",
    icon: "faMailBulk",
    coment: "Reenviar a..",
    key: "reenviar",
    print: function () {
      return this.title;
    }
  },
  leido: {
    title: "leido",
    icon: "faEnvelopeOpen",
    comment: "marcado como leido",
    key: "leido",
    print: function () {
      return this.title;
    }
  },
  ignorar: {
    title: "Ignorar",
    icon: "faMailBulk",
    coment: "Ignorar",
    key: "ignorar",
    print: function () {
      return this.title;
    }
  },
  reenviado: {
    title: "Reenviado",
    to: null,
    icon: "faReply  ",
    coment: "Reenviado",
    key: "reenviado",
    print: function () {
      return this.title;
    }
  }
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ credenciales })
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
      "Content-Type": "application/json"
    }
  };

  let url = `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/getAddressBook?page=${page}`;
  console.log(url);
  onRetrieveUrl(url, header, callback);
};

const sendEmailToDb = (credenciales, email, callback) => {
  console.log("constants=>sendEmailToDb");
  onRetrieveUrl(
    `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/sendEmailToDb`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ credenciales, email })
    },
    (data, err) => {
      callback(data, err);
    }
  );
};

const retrieveAllFromDb = async (callback) => {
  onRetrieveUrl(
    `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/updateEmailFromDb`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cantidad: 0 })
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
      break;
    case "normal":
      return "#79dd79";
      break;
    case "spam":
      return "#ef6868";
      break;
    default:
      return "white";
      break;
  }
};

module.exports = {
  PORT_BACKEND,
  URL_DATABASE,
  URL_PROTOCOL,
  printMail,
  onRetrieveUrl,
  onRetrieveUrl2,
  retrieveAllFromDb,
  sendEmailToDb,
  getSentEmails,
  DEFAULT_POST_HEADER,
  Status,
  makeReduce,
  getDataAdreesBook,
  getStyleForState
};
