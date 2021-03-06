const PORT_BACKEND = "5100";
const URL_DATABASE = "localhost";
const URL_PROTOCOL = "http";

// const pako = require("pako");

const URL_BACKEND = "192.168.1.27";

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

  let url = `${URL_PROTOCOL}://${URL_DATABASE}:${PORT_BACKEND}/getAddressBook?page=${page}`;
  console.log(url);
  onRetrieveUrl(url, header, callback);
};

const sendEmailToDb = (credenciales, email, callback) => {
  console.log(`constants=>sendEmailToDb ${email}`);

  try {
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

const getText = () => {
  return `
  <h3 style="text-align:center">
    Devs Just Want to Have Fun by Cyndi Lauper
  </h3>
  <p style="text-align:center">
    I come home in the morning light<br>
    My mother says, <mark>???When you gonna live your life right????</mark><br>
    Oh mother dear we???re not the fortunate ones<br>
    And devs, they wanna have fun<br>
    Oh devs just want to have fun</p>
  <p style="text-align:center">
    The phone rings in the middle of the night<br>
    My father yells, "What you gonna do with your life?"<br>
    Oh daddy dear, you know you???re still number one<br>
    But <s>girls</s>devs, they wanna have fun<br>
    Oh devs just want to have
  </p>
  <p style="text-align:center">
    That???s all they really want<br>
    Some fun<br>
    When the working day is done<br>
    Oh devs, they wanna have fun<br>
    Oh devs just wanna have fun<br>
    (devs, they wanna, wanna have fun, devs wanna have)
  </p>
`;
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
console.log(module.exports);
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
  getText,
  printMail,
};
