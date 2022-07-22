// const Blob = require("node:buffer").Blob;
const __MODULE_FILE__ = "BACKEND-HTTP";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const path = require("path");
const pako = require("pako");
// const FileReader = require("filereader");

const {
  retrieveLast,
  retrieveRef,
  retrieve,
  count,
} = require("../../backends/backend-email-api/server");

const {
  addStatus,
  changeStatus,
  retrievePrefs,
  retrieveList,
  updateEmailFromDB,
  retrieveMailFromDb,
  retrieveLastFromDb,
  PG_sendEmailToDb,
  PG_retrieveReaded,
  PG_getSentEmailForUser,
  PG_retrieveForStatus,
  PG_getEmailForMessageId,
  getAdressBook,
  saveMailToDb,
  addUser,
  logUser,
} = require("../../backends/backend-postgres-api/postgresql");

const { PORT_BACKEND, printMail } = require("../../constants");
// const { CLIENT_RENEG_LIMIT } = require("tls");

const app = express();
var allowedOrigins = [
  "http://localhost:3001",
  "http://127.0.0.1:5100",
  "http://localhost:3000",
  "http://192.168.1.27:3001",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin." +
          origin;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());

app.use(compression());

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 5000,
  })
);

app.use(express.static(path.join(__dirname, "public")));

const port = PORT_BACKEND || 5000;

function range(start, end) {
  if (start === null || end === null) return [];
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}

app.post("/retrieveRef", (req, resp) => {
  console.log("RetrieveRef[http]");
  let ref = req.body.ref;
  console.log(ref);
  retrieveRef(ref, (err, result) => {
    console.log(result);
    if (err) {
      console.log(error);
      resp.status(502).json({ err });
    } else {
      console.log(result);
      resp.status(200).json({ result });
    }
  });
});

app.post("/retrieveReaded", (req, resp) => {
  console.log(`retrieveReaded-${__MODULE_FILE__}`);

  const cantidad = req.body.cantidad;
  const credenciales = req.body.credenciales;

  PG_retrieveReaded(cantidad, credenciales, function (result, err) {
    if (err) {
      console.log(err);
      return resp.status(501).json({ error: err });
    }

    // console.log("retrieveReaded-R-", result);
    let data = result.map((row) => row.mail);
    // console.log("retrieveReaded-R-", data);

    addStatus(data, function (rows) {
      console.log("retrieveReaded", data.length);
      resp.status(200).json({ rows });
    });
  });
});

app.post("/retrieveForStatus", (req, resp) => {
  console.log("retrieveForStatus-------");

  const cantidad = req.body.cantidad;
  const credenciales = req.body.credenciales;
  const status = req.body.status;

  PG_retrieveForStatus(cantidad, credenciales, status, function (result, err) {
    console.log();
    if (err) {
      console.log(err);
      return resp.status(501).json({ error: err });
    }

    // console.log("retrieveReaded-R-", result);
    let data = result.map((row) => row.mail);
    // console.log("retrieveReaded-R-", data);

    addStatus(data, function (rows) {
      console.log("retrieveForStatus", data.length);
      resp.status(200).json({ rows });
    });
  });
});

app.post("/retrieve", (req, resp) => {
  console.log("Retrieve x id");
  console.log(req.body);
  let registro = req.body.id;
  if (registro) {
    retrieve(registro, function (err, email) {
      if (err) {
        console.log(err);
        resp.status(501).json({ error: err });
      } else {
        //  console.log(email);
        resp.status(200).json(email);
      }
    });
  }
});

const joinResp = (message) => {
  console.log(message);
};

app.post("/retrieveUlserList", (req, resp) => {
  const { cred } = req.body;
  retrieveList((error, result) => {
    if (error) {
      return resp.status(501).json({ error });
    }
    resp.status(200).json({ rows: result });
  });
});

app.post("/changeStatus", (req, resp) => {
  console.log(`change status bdy:${JSON.stringify(req.body)}`);
  let { id_generador, id, newStatus, leido, mail, to_id } = req.body;
  console.log(`id ${id}  newStatus: ${newStatus},${leido}`);
  changeStatus(
    id_generador,
    id,
    newStatus,
    leido,
    mail,
    to_id,
    function (result) {
      // console.log(result);
      resp.status(200).json({ result });
    }
  );
});

app.post("/retrieveAll", (req, resp) => {
  retrieveAll();
});

app.post("/retrieveCount", (req, resp) => {
  console.log(`retrieveCount ${__MODULE_FILE__}`);

  count(function (err, info) {
    console.log("count callback");
    if (err !== null) {
      console.log(`inf (http): ${err}`);
      return resp.status(512).json({ message: err });
    } else {
      resp.status(200).json({ cantidad: info });
    }
  }, false);
});

app.get("/statusApp", (req, resp) => {
  console.log(`${__MODULE_FILE__} status`);
  resp.status(200).json({ status: "ok" });
});
/*
app.get("/api/password", (request, response) => {
  let p = [];
  console.log(JSON.stringify(request.body));
  p.push(request.body.user);
  p.push(request.body.password);
  p.push(origin);

  console.log("req: " + JSON.stringify(request.body));
  const query = {
    text: "select * from register  WHERE(  origin = $3 and   ((email = $1  AND clave = crypt( $2 , clave))  OR ( nombre = $1 and clave = crypt($2 , clave)))) ;",
    values: p,
  };

  client.connect();

  client.query(query, p, (err, res) => {
    if (err) {
      console.log("error");
      console.log(err.stack);
    } else {
      console.log("NOO error");
      client.end();

      console.log(JSON.stringify(res));
      response.status(200).json(JSON.stringify(res));
    }
  });
});
*/
app.post("/setdtos", (req, resp) => {
  console.log(req.body);
  addUser(req.body, function (count, error) {
    if (error) {
      resp.status(501).json({ error: error });
    } else {
      resp.status(200).json({ data: "ok", count: count });
    }
  });
});

app.post("/retrievePrefs", (req, resp) => {
  console.log(req.body);
  console.log("retreive prefs");
  let user = req.body.user;
  console.log(user);
  console.log(user.id);
  retrievePrefs(user.id, function (error, result) {
    if (error) {
      resp.status(501).json({ error });
    } else {
      resp.status(200).json({ lista: result.data });
    }
  });
});
// mailes enviados por el user
app.post("/getSentEmailForUser", (req, resp) => {
  // console.log(`getSentEmailForUser ${JSON.stringify(req.body)}`);
  const { credenciales } = req.body;
  PG_getSentEmailForUser(credenciales, (data, err) => {
    // console.log(data);
    if (err) {
      return resp.status(501).json({ error: err });
    }
    // wrap para que parezca un email
    let emails = data.map((email) => wrapEmail(email));
    return resp.status(200).json({ result: emails });
  });
});

const getEmailForAttach = async (id) => {
  let resu = await PG_getEmailForMessageId(id);
  return resu;
};
const btoa = (text) => {
  return Buffer.from(text, "binary").toString("base64");
};

function Uint8ToBase64(u8Arr) {
  console.log(u8Arr);
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = "";
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
    git;
  }
  return btoa(result);
}

function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }

  return out;
}

const base64_arraybuffer = async (data) => {
  // Use a FileReader to generate a base64 data URI
  console.log(data);
  const base64url = await new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result);
    reader.readAsDataURL(new Blob([data]));
  });

  /*
  The result looks like 
  "data:application/octet-stream;base64,<your base64 data>", 
  so we split off the beginning:
  */
  return base64url.split(",", 2)[1];
};

const attachmentOf = async (attach) => {
  console.log(`data ${attach.content.data}`);
  let data = await base64_arraybuffer(attach.content.data);

  return {
    fileName: attach.fileName,
    content: data,
    encoding: "base64",
  };
};

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

app.post("/sendEmailToDb", async (req, resp) => {
  let attachments;
  console.log(`${__MODULE_FILE__}-->sendEmailToDb`);
  //  console.log(req.body);

  try {
    // let stringBody = pako.ungzip(req.body.gZipString, { to: "string" });
    //  let body = JSON.parse(stringBody);

    // console.log(`body=${req.body}`);
    let { email, credenciales } = req.body;
    console.log(email);
    if (email.sendAttach) {
      if (!email.attachments) console.log("No tenia attachments");
      let result = await getEmailForAttach(email.messageId);
      attachments = result.result;
      //  console.log(attachments);
      for (let index = 0; index < attachments.length; index++) {
        const element = attachments[index];
        let buffer = arrayBufferToBase64(element.content.data);

        email.attachments.push({
          // encoded string as an attachment
          filename: element.fileName,
          content: buffer,
          encoding: "base64",
          contentType: element.contentType,
        });
        // email.attachments.push({
        //   fileName: element.fileName,
        //   path: `data:${element.contentType};base64,${buffer}`,
        // });
      }
      // console.log(attachmentOf(attachments[0]));
    }
    PG_sendEmailToDb(
      credenciales,

      email,
      (data, err) => {
        if (err) {
          return resp.status(500).json({ error: err });
        }
        return resp.status(200).json({ result: data });
      }
    );
  } catch (error) {
    console.error(error);
    return resp.status(500).json({ error });
  }
});

app.post("/retrieveLast", (req, resp) => {
  console.log(`retrieveLast-${__MODULE_FILE__}`);

  let { cantidad, credenciales } = req.body;
  console.log(`retrieveLastDB ${cantidad} de ${JSON.stringify(credenciales)}`);

  /* del api de email retrievelast */
  retrieveLastFromDb(cantidad, credenciales, function (rows, error) {
    if (error) {
      console.error(error);
      return resp.status(511).json(error);
    }

    console.log(`Enviados ${rows.length} emails`);
    addStatus(rows, function (drows) {
      resp.status(200).json({ data: drows });
    });
  });
});
// para que el enviado se parezca a un  email
const wrapEmail = (emailSent) => {
  const date = new Date(emailSent.fecha_sent);

  return {
    cc: [],
    date: date,
    from: emailSent.from_,
    to: emailSent.to_,
    subject: emailSent.subject,
    headers: {},
    text: emailSent.data,
    html: emailSent.html,
    leido: true,
    reenviado_fecha: date,
    messageId: emailSent.messagee_id,
    receivedDate: emailSent.fecha_sent,
    priority: "normal",
    state_: "normal",
    reenviado: 0,
    reenviado_fecha: date,
    references: [],
  };
};

app.post("/getMailFromDb", (req, resp) => {
  retrieveMailFromDb((error, mail) => {
    if (error) {
      console.log(error);
      return resp.status(501).json({ error: error });
    }
    resp.status(200).json({ mail: mail });
  });
});

app.get("/getAddressBook", async (req, resp) => {
  console.log("getAddressBook");
  console.log(req.query);
  const { page } = req.query;
  await getAdressBook(page, (error, response) => {
    if (error) {
      console.error(error);
      resp.status(521).json(error);
    } else {
      resp.status(200).send(response);
    }
  });
});

app.post("/updateEmailFromDb", async (req, resp) => {
  console.log(`updateEmailFromDb->${__MODULE_FILE__}`);
  let data;
  let contador = 0;
  const updateAllMailToDb =
    require("../backend-postgres-api/postgresql").updateAllMailToDb;
  await updateAllMailToDb((error, response) => {
    if (error) {
      console.error(error);
      return resp.status(521).json(error);
    }
    console.log(`finalizó ${JSON.stringify(response)}`);
    return resp.status(200).json(response);
  });
});

app.post("/saveAllEmailToDB", (req, resp) => {
  console.log("Save All to DB");
  console.log(req.body);
  saveMailToDb(function (err, response) {
    if (err) {
      console.error(err);
      return resp.status(501).json({ error: err });
    } else return resp.status(200).json(response);
  });
});

app.post("/savemail", (req, resp) => {
  console.log("Retriesav && email d");
  console.log(req.body);
  let registro = req.body.id;
  if (registro) {
    retrieve(registro, function (err, email) {
      if (err) {
        console.log(err);
        resp.status(501).json({ error: err });
      } else {
        saveMailToDb(email, function (error, dbResponse) {
          if (error) {
            resp.status(501).json(error);
          } else resp.status(200).json(dbResponse);
        });
      }
    });
  }
});

app.post("/loginUser", (req, resp) => {
  console.log("loginUser");
  let { user, password } = req.body;
  console.log(req.body);
  logUser(user, password, function (row, error) {
    if (error) resp.status(401).json({ error });
    else {
      console.log(count);
      resp.status(200).json({ result: row[0] });
    }
  });
});

app.listen(port, () => console.log(`server started port:${port}`));
