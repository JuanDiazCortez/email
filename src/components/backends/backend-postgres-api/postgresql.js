const { Client } = require("pg");
const { URL_DATABASE, printMail } = require("../../constants");
const { sendMail } = require("../backend-email-api/_SendMail");
const path = require("path");
const { log } = require("console");
const data = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

console.log(data);
const getClient = () =>
  new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_URL,
    database: process.env.DATABASE_DB,
    password: process.env.DATABASE_PASSWD,
    port: 5432,
  });

const client = getClient();
client.connect();

const getUsers = async () => {
  let client = getClient();
  try {
    await client.connect();
    let Qry = "select * from webinfo.users ";
    let result = await client.query(Qry);
    client.end();
    return result.rows;
  } catch (error) {
    client.end();
    console.log(error);
  }
};

// assign status to row mail
const assingStatus = (users, rows, emails) => {
  // console.log(`${JSON.stringify(rows, null, 2)}`);
  const searchInRow = (id) => {
    return rows.filter((row) => row.idmail === id);
  };

  /* sigue con los encontrados */
  let newList = emails.map((item) => {
    let dRow = searchInRow(item.messageId);
    let user;
    let newItem;
    if (dRow.length != 0) {
      if (dRow[0].status === "reenviado") {
        user = users.find((user) => user.id === dRow[0].id_user_to);
        if (user === undefined) user = {};
      }
      newItem = {
        ...item,
        state: dRow[0].status,
        leido: dRow[0].leido,
        reenviado: user,
        reenviado_fecha: dRow[0].lastdate,
      };
    } else {
      /* aca van defaults cuando no encuentra el status en la db*/
      newItem = {
        ...item,
        state: "normal",
        leido: false,
        reenviado: 0, // not user default value;
        reenviado_fecha: new Date(),
      };
    }

    return newItem;
  });

  return newList;
};

const arrayToString = (array) => {
  let count = array.length;
  console.log(`count ${array.length} `);
  let aString = "(";
  array.map((item, index) => {
    aString += "'" + item + "'";
    aString += index + 1 != count ? "," : "";
  });
  aString += ")";
  return aString;
};

const retrievePrefs = async (id, callBack) => {
  const query = "select data from webinfo.prefs where id_user = $1 ";
  let client = getClient();

  try {
    await client.connect();
    let result = await client.query(query, [id]);
    console.log(result);
    callBack(null, result.rows[0]);
  } catch (error) {
    callBack(error, null);
  } finally {
    client.end();
  }
};
const isAdmin = async (id) => {
  const query = {
    text: `select admin from webinfo.users where id=$1`,
    values: [id],
  };

  let client = getClient();

  try {
    await client.connect();
    let result = await client.query(query);
    client.end();
    // console.log(result);
    if (result.rowCount > 0 && result.rows.length > 0) {
      return result.rows[0].admin;
    }
    return false;
  } catch (error) {
    client.end();
    console.log(error);
    return false;
  }
};

async function getMailsOff(list) {
  console.log(`getMailsOff  ${list}`);
  let stList = arrayToString(list);
  const Qry = `select mail from webinfo.emails where mail->>'messageId' in ${stList} `;

  // console.log(Qry);
  let client = getClient();
  try {
    await client.connect();
    let result = await client.query(Qry);
    client.end(); // free resources
    // console.log(result.rows);
    if (result.rows && result.rowCount > 0) {
      return result.rows;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

const retrieveLastFromUser = async (id, callBack) => {
  console.log(`retrieveLastFromUser id=${id}`);
  const Qry = {
    text: `select * from webinfo.mailstatus where id_user_to = $1`,
    values: [id],
  };
  console.log(Qry);
  let client = getClient();
  try {
    await client.connect();
    let result = await client.query(Qry);
    //  console.log(result.rows);
    client.end();
    if (result.rows && result.rowCount > 0) {
      console.log("a buscar los mails");
      const lista = result.rows.map((row) => row.idmail);
      const emails = await getMailsOff(lista);
      //  console.log(emails);
      let newList = emails.map((item) => item.mail);
      callBack(newList, null);
    }
  } catch (error) {
    callBack(null, error);
    console.log(error);
  }
};

const PG_retrieveReaded = async (cantidad, credenciales, callBack) => {
  console.log("PG_retrieveReaded");

  let Qry = `select mail from webinfo.emails 
  where  mail->>'messageId' in ( select idmail from   webinfo.mailstatus where id_user=${credenciales.id} and leido and status ='normal' )  limit  ${cantidad};`;
  console.log(Qry);
  let client = getClient();
  try {
    await client.connect();
    let result1 = await client.query("SET enable_seqscan = OFF;");
    let result = await client.query(Qry);
    client.end();
    // console.log(result.rows);
    callBack(result.rows, null);
  } catch (error) {
    callBack(null, error);
    console.log("Error", error);
  }
};

const PG_retrieveForStatus = async (
  cantidad,
  credenciales,
  status,
  callBack
) => {
  console.log("PG_retrieveForStatus ***");

  let Qry = `select mail from webinfo.emails 
  where  mail->>'messageId' in ( select idmail from 
     webinfo.mailstatus
      where id_user=${credenciales.id} and status='${status}' ) 
       limit  ${cantidad};`;

  console.log(Qry);

  let client = getClient();
  try {
    await client.connect();
    let result1 = await client.query("SET enable_seqscan = OFF;");
    let result = await client.query(Qry);
    client.end();

    callBack(result.rows, null);
  } catch (error) {
    callBack(null, error);
    console.log("Error", error);
  }
};

const retrieveLastFromDb = async (cant, credenciales, callBack) => {
  console.log(
    `retrieve from db cantidad=${cant} de: ${JSON.stringify(credenciales)}`
  );
  const admin = await isAdmin(credenciales.id);
  if (!admin) {
    console.log("no es admin");
    retrieveLastFromUser(credenciales.id, callBack);
  } else {
    let Qry = `select mail from webinfo.emails order by id desc limit ${cant}`;
    let client = getClient();
    try {
      await client.connect();
      let result = await client.query(Qry);
      client.end();
      let newList = result.rows.map((item) => item.mail);
      callBack(newList, null);
    } catch (error) {
      callBack(null, error);
      console.log(error);
    }
  }
};

const PG_getSentEmailForUser = async (credenciales, callback) => {
  console.log(`Pg: getSentEmailForUser`);
  console.log(credenciales);
  const query = {
    text: `select webinfo.readtext(attach) as data ,* 
      from  "webinfo"."emails_sent"
       where user_sent=$1`,

    values: [credenciales.id],
    rowAsArray: true,
  };
  console.log(`Qry ${query.text}`);
  let client = getClient();
  try {
    await client.connect();
    let result = await client.query(query);
    console.log(result.rows.length);
    client.end();
    console.log(result.rows);
    callback(result.rows, null);
  } catch (error) {
    callback(1, error);
    console.log(error);
  }
};
const PG_sendEmailToDb = async (credenciales, email, callback) => {
  console.log(`Pg: sendEmailToDb ${JSON.stringify(email, null, 2)}`);
  //  console.log(credenciales);

  const query = {
    text: `INSERT INTO "webinfo"."emails_sent" ("messagee_id","to_","from_","subject","texto","html","attach","user_sent", "result")
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,
    values: [
      email.messageId,
      email.to[0],
      "info@richelet.com.ar",
      email.subject,
      "",
      "",
      email,
      credenciales.id,
    ],
  };

  let client = getClient();
  try {
    let info = await sendMail(email, credenciales);
    // add response of send email
    query.values = [...query.values, info];
    console.log(`Pg: sendEmailToDb query ${JSON.stringify(query, null, 2)}`);

    await client.connect();
    let result = await client.query(query);
    console.log(result);
    client.end();
    callback(result.rowCount, null);
  } catch (error) {
    callback(null, error);
    console.log(error);
  }
};

const addUser = async (datos, callback) => {
  console.log(`Pg: addUser ${JSON.stringify(datos)}`);
  let email = datos.email;
  let user = datos.user;
  let nombre = datos.nombre;
  let apellido = datos.apellido;
  let documento = datos.documento;
  let passwd = datos.passwd;

  const query = {
    text: `insert into webinfo.users(email, usuario,nombre,apellido, doc,passwd ) 
     values($1,$2,$3,$4,$5,webinfo.crypt($6,webinfo.gen_salt('bf')))`,
    values: [email, user, nombre, apellido, documento, passwd],
  };

  let client = getClient();

  try {
    await client.connect();
    let result = await client.query(query);
    console.log(result);
    client.end();
    callback(result.rowCount, null);
  } catch (error) {
    callback(-1, error);
    console.log(error);
  }
};

const retrieveList = async (callBack) => {
  const Qry = `SET search_path TO webinfo;
  select id, nombre, apellido, email from webinfo.users;`;
  console.log(Qry);
  let client = getClient();

  try {
    await client.connect();
    let result = await client.query(Qry);
    // let result = await data.json();
    //   console.log(result);
    callBack(null, result[1].rows);
  } catch (error) {
    callBack(error, null);
    console.log(error);
  }
};

const logUser = async (user, passwd, callback) => {
  console.log("loguser");
  const query = {
    text: `select id, hash  from  webinfo.users where usuario=$1 and passwd= webinfo.crypt($2,passwd) `,
    values: [user, passwd],
  };

  console.log(query);
  let client = getClient();

  try {
    await client.connect();
    let result = await client.query(query);
    console.log(result.rowCount);
    client.end();
    if (result.rowCount === 1 && result.rows[0].id) {
      console.log("hay row en user ");
      /* actualiza el hash del user  */
      console.log(result.rows[0].id);
      if (updateLogin(result.rows[0].id)) {
        callback(result.rows, null);
      } else {
        callback(-1, error);
        console.log(error);
      }
    }
  } catch (error) {
    callback(-1, error);
    console.log(error);
  }
};

async function updateLogin(id) {
  console.log(`updateLogin ${id}`);
  const query = {
    text: `update webinfo.users set lastlogin=now() , 
     hash= gen_random_uuid() where id=$1 `,
    values: [id],
  };

  let client = getClient();

  try {
    await client.connect();
    let result = await client.query(query);
    console.log(query);
    console.log(result.rowCount);
    client.end();
    if (result.rowCount === 1 && result.rows.length === 1) {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
const addStatus = async (emails, callbackReturn) => {
  console.log("ADDSTATUS!!!!");
  // console.log(emails[0]);
  let client = getClient();
  /* collect messageId */

  let data = emails.map((item) => item.messageId);
  let aString = arrayToString(data);
  // console.log(aString);
  if (aString === "()") {
    return callbackReturn([]);
  }
  const queryString = `select id_user,id_user_to, status,idmail,leido ,lastdate from webinfo.mailstatus where idmail in ${aString}`;
  // console.log(queryString);
  try {
    await client.connect();
    let users = await getUsers();
    let results = await client.query(queryString);
    // console.log(results.rows);

    let asigned = assingStatus(users, results.rows, emails);
    // console.log(asigned);
    callbackReturn(asigned);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};
const retrieveMailFromDb = async (callBack) => {
  let client = getClient();
  // let Qry =
  const Qry = {
    text: "select mail from webinfo.emails;",
    rowAsArray: true,
  };
  try {
    await client.connect();
    let results = await client.query(Qry);
    console.log(results);
    client.end();
    callBack(null, results);
  } catch (error) {
    console.log(error);
    client.end();
    callBack(error, null);
  } finally {
    client.end();
  }
};

const updateEmailFromDB = async (callBack) => {
  console.log("updateEmailFromDb-email-api");

  let client = getClient();
  let Qry = `select mail->'messageId'as messageId, mail->'receivedDate' as receivedDate
   from webinfo.emails
   where id=(select max(id)-1 
   from webinfo.emails);`;

  await client.connect();
  try {
    let result = await client.query(Qry);
    //  console.log(result);
    callBack(null, result);
  } catch (error) {
    callBack(error, null);
  }
  client.end();
};

const getAdressBook = async (page, callBack) => {
  console.log("getAdrressBoock");
  /*

*/
  let Qry = `with extracted as (select id, 
  unnest(xpath('/c:contact/c:NameCollection//c:FormattedName/text()',contact,'{{c,http://schemas.microsoft.com/Contact}}'))::TEXT as company ,
  unnest(xpath('/c:contact/c:EmailAddressCollection/c:EmailAddress/c:Address/text()',contact,'{{c,http://schemas.microsoft.com/Contact}}'))::TEXT as  address  
   from webinfo.contacts) select id,company , address from extracted  order by company limit 50 offset  ${page} ;`;

  const format = (t) => {
    return t.replace("&amp;", "&").replace(/;/g, "");
  };
  let client = getClient();
  try {
    await client.connect();
    let result = await client.query(Qry);
    let newList = result.rows.map((contact, index) => {
      if (index === 0) console.log(contact);
      let resp = {
        id: contact.id,
        company: format(contact.company),
        adress: contact.address,
      };
      return resp;
    });
    callBack(null, newList);
  } catch (error) {
    console.log(error);
    callBack(error, null);
  }
};

const updateAllMailToDb = async (callBack) => {
  const Qry = {
    name: "insert_mails",
    text: "select * from webinfo.updateemails($1)",
    rowAsArray: true,
  };
  let r;

  //  console.log(client._connected);
  let object = {
    clientPG: getClient,
    query: Qry,
  };
  var retrieveAllFromMail =
    require("../backend-email-api/server").retrieveAllFromMail;
  await retrieveAllFromMail(object, callBack);
};

const saveMailToDb = async (callBack) => {
  const Qry = {
    text: "insert into webinfo.emails_update( mail) values($1)",
    rowAsArray: true,
  };
  let r;
  let client = getClient();
  await client.connect();
  let object = { clientPG: getClient, query: Qry };
  var retrieveAllFromMail =
    require("../backend-email-api/server").retrieveAllFromMail;
  retrieveAllFromMail(object, callBack);
  client.end();
};

const changeStatus = async (
  id_generator,
  id,
  status,
  leido,
  email,
  toid,
  callbackReturn
) => {
  let client = getClient();

  let queryString;
  console.log(status);
  switch (status) {
    case "leido":
      queryString = `SET search_path TO webinfo;
    select * from  updateleido(${id_generator},'${id}',${leido});`;

      break;
    case "spam":
      queryString = `SET search_path TO webinfo;
   select * from  updatestatus(${id_generator},'${id}','${status}');`;
      break;
    case "delete":
      queryString = `SET search_path TO webinfo;
   select * from  updatestatus(${id_generator},'${id}','${status}');`;
      break;
    case "reenviado":
      queryString = `SET search_path TO webinfo;
      select * from  updateenviado(${id_generator},${toid},'${id}','${status}');`;
    default:
      break;
  }

  console.log(`Qry=${queryString}`);
  try {
    await client.connect();
    let results = await client.query(queryString);
    console.log(results);
    callbackReturn(results);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

module.exports = {
  addStatus,
  changeStatus,
  retrievePrefs,
  retrieveList,
  retrieveMailFromDb,
  updateEmailFromDB,
  updateAllMailToDb,
  PG_getSentEmailForUser,
  PG_retrieveForStatus,
  PG_sendEmailToDb,
  PG_retrieveReaded,
  retrieveLastFromDb,
  getAdressBook,
  saveMailToDb,
  addUser,
  logUser,
};
