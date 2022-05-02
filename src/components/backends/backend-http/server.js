const __MODULE_FILE__ = "BACKEND-HTTP";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const path = require("path");
const {
  retrieveLastNew,
  retrieveLastOld,
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
  getAdressBook,
  saveMailToDb,
  addUser,
  logUser,
} = require("../../backends/backend-postgres-api/postgresql");

const { PORT_BACKEND, printMail } = require("../../constants");
const { CLIENT_RENEG_LIMIT } = require("tls");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(compression());
app.use(
  bodyParser.json({
    limit: "10mb",
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
  let lastRow;

  console.log("retrieveCount");
  count(function (err, info) {
    console.log("count");
    if (err) {
      console.log(err.info);
      resp.status(501).json({ message: err });
    }
    resp.status(200).json({ cantidad: info });
  }, true);
});

app.get("/statusApp", (req, resp) => {
  response.status(200).json({ status: "ok" });
});

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

app.post("/getSentEmailForUser", (req, resp) => {
  console.log(`getSentEmailForUser ${JSON.stringify(req.body)}`);
  const { credenciales } = req.body;
  PG_getSentEmailForUser(credenciales, (data, err) => {
    console.log(data);
    if (err) {
      return resp.status(501).json({ error: err });
    }

    let emails = data.map((email) => wrapEmail(email));
    return resp.status(200).json({ result: emails });
  });
});

app.post("/sendEmailToDb", (req, resp) => {
  console.log(`${__MODULE_FILE__}-->sendEmailToDb`);
  console.log(req.body);
  let { email, credenciales } = req.body;
  // console.log(credenciales);

  PG_sendEmailToDb(credenciales, email, (data, err) => {
    if (err) {
      return resp.status(500).json({ error: err });
    }
    return resp.status(200).json({ result: data });
  });
});

app.post("/getSentEmailForUser_old ", (req, resp) => {
  console.log(`getSentEmailForUser ${JSON.stringify(req.body)}`);
  const { credenciales } = req.body;
  PG_getSentEmailForUser(credenciales, (data, err) => {
    console.log(data);
    if (err) {
      return resp.status(501).json({ error: err });
    }
    return resp.status(200).json({ result: data });
  });
});

app.post("/sendEmailToDb", (req, resp) => {
  console.log("/sendEmailToDb");
  console.log(req.body);
  let { email, credenciales } = req.body;
  console.log(credenciales);

  PG_sendEmailToDb(credenciales, email, (data, err) => {
    if (err) {
      return resp.status(501).json({ error: err });
    }
    return resp.status(200).json({ result: data });
  });
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

const wrapEmail = (emailSent) => {
  const date = new Date(emailSent.fecha_sent);
  //  console.log(`wrapp DB ${emailSent.fecha_sent}`);
  //  console.log(`wrapp ${date}`);

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
    reenviado: 1,
    reenviado_fecha: date,
    references: [],
  };
};

app.post("/retrieveLast2", (req, resp) => {
  console.log(`retrieveLast2-${__MODULE_FILE__}`);
  let registros = req.body.cantidad || 20;

  console.log(`retrieveLast ${registros}`);
  count(function (err, info) {
    if (err) {
      console.log(err.info);
      return resp.status(501).json({ message: err.message });
    }

    console.log(`info ${info}`);
    lastRow = info;
    const regs = range(lastRow - registros, lastRow);
    console.log(`Regs: ${regs} length ${regs.length}`);
    /* del api de email retrievelast */

    retrieveLast(regs, function (error, messages) {
      if (error) {
        return resp.status(501).json(error);
      }
      if (!messages) {
        messages = [];
      }
      console.log(`Enviados ${messages.length} emails`);
      let data = messages.filter((e, i) => e !== null);
      console.log("addStatus call");
      addStatus(data, function (rows) {
        //  printMail(rows[0]);
        // console.log(rows);
        resp.status(200).json({ data: rows });
      });
    });
  });
});

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
      console.log("finalizó");
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
