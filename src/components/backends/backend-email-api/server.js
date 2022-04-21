const __MODULE_FILE__ = "BACKEND-EMAIL-API";
const Client = require("node-poplib-yapc").Client;
const MailParser = require("mailparser-mit").MailParser;
const { saveMailToDb } = require("../backend-postgres-api/postgresql");

const path = require("path");
const data = require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});
console.log(path.resolve(__dirname, "../.env"));
console.log(data);

var _numero = 0;
const mailparser = new MailParser();
mailparser.on("end", function(mail_object) {
  console.log("end parser");
  console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
  console.log("Subject:", mail_object.subject); // Hello world!
  console.log("Text body:", mail_object.text); // How are you today?
});

const client = new Client({
  hostname: process.env.REACT_APP_EMAIL_ADDRESS,
  port: 995,
  tls: true,
  mailparser: true,
  parserOptions: { mailParser: mailparser, showAttachmentLinks: false },
  username: "info@richelet.com.ar",
  password: process.env.REACT_APP_EMAIL_PASSWORD
});
console.log(`EMAIL:ADDRESS -> ${process.env.REACT_APP_EMAIL_ADDRESS}
  EMAIL_ACCOUNT ->${process.env.REACT_APP_EMAIL_ACCOUNT}
  EMAIL_PASSWORD ->${process.env.REACT_APP_EMAIL_PASSWORD}
  `);
console.log(`CLIENT->${JSON.stringify(client, null, 2)} `);

const getClientNotParsed = () => {
  return new Client({
    hostname: process.env.REACT_EMAIL_ADDRESS,
    port: 995,
    tls: true,
    debug: false,
    mailparser: false,
    parserOptions: { showAttachmentLinks: false },
    username: process.env.REACT_EMAIL_ACCOUNT,
    password: process.env.REACT_EMAIL_PASSWORD
  });
};

const parse = async (parser, email) => {
  return new Promise((resolve, reject) => {
    parser.on("end", function(element) {
      resolve(element);
    });

    parser.on("error", function(err) {
      reject(err);
    });

    parser.write(email);
    parser.end();
  });
};

const retrievePromess = async (popServer, callback) => {
  //
  return new Promise((resolve, reject) => {
    popServer.on("data", function(data) {
      console.log("resolve data ");
      resolve(data);
    });

    popServer.on("error", function(error) {
      console.log("resolve error");
      reject(error);
    });

    popServer.connect(() => {
      callback(popServer);
    });
  });
};

const retrieveNewFrom = (messageID, receiveDate, callBack) => {
  retrieveLast(50, function(error, result) {
    if (error) {
      console.error(error);
      callBack(error, null);
    } else {
      callBack(null, result);
    }
  });
};
/* objconn client pg + query   
atravieza todos los mensajes y 
los inserta en la db si es exitoso no hace nada
al final informa el total de insertados
*/

const saveEmailToDb = async (fConn, query, email) => {
  let conn = fConn();
  let retVal;
  await conn.connect();
  try {
    console.log("__1");
    console.log(sendMail(email, { user: "pepe" }));

    let result = await conn.query(query, [email]);
    console.log(`__11 ${result}`);
    conn.end();

    retVal = { update: result, error: null };
  } catch (error) {
    console.log(`__2 ${error}`);
    retVal = { update: null, error: error };
  } finally {
    if (conn._connected) conn.end();
  }
  console.log("__333");
  return retVal;
};
const serie = stop => {
  resp = [];
  for (let index = 0; index < stop; index++) {
    resp.push(index);
  }
  return resp;
};

const retrieveAllFromMail_new = async (objConn, callBack) => {
  console.log(`retrieveAllFromMail-${__MODULE_FILE__}`);
  //  console.log(objConn);

  const { clientPG, query } = objConn;
  let log;
  let resultado;
  let pop3Server = client;
  //  console.log(`client-->${JSON.stringify(client, null, 2)}`);

  try {
    pop3Server.connect(function() {
      count((error, cantidad) => {
        if (error) console.log(error);
        console.log(cantidad);

        retrieve(714, (err, res) => {
          console.log(res);
        });

        _numero = 0;
        let salir = false;
        for (let index = cantidad; index > 0; index--) {
          //   console.log(`0000000000000000000002222222 ${index}`);
          retrieve(index, (err, message) => {
            console.log("11112");
            if (err) {
              console.log(err);
              return callBack(err, null);
            }
            console.log(message);
            try {
              console.log(_numero++);
              let result = saveEmailToDb(clientPG, query, message);
              if (result.error) {
                console.log(result.error);
              }
              if (!result.update) {
              }
              console.log(`result -->${JSON.stringify(result)}`);
            } catch (e) {
              console.log("999999999999999999");
              console.log(e);

              // return callBack(e, null);
            }
            return callBack(null, {
              response: "ok",
              largo: log,
              updated: _numero
            });

            console.log("333333");
            pop3Server.quit();
            // connection.end();
            console.log("**********");
            return callBack(null, {
              response: "ok",
              largo: log,
              updated: _numero
            });
          }); // RETRIEVE
          break;
        } // for
        console.log("salioo 0000000000000000000000");
        return callBack(null, {
          response: "ok",
          largo: log,
          updated: _numero
        });
      }, false);
    }); //count
  } catch (error) {
    console.log("erorrrrrrrrrrrrrrrrrrrrrr");
  }
};

const retrieveAllFromMail = async (objConn, callBack) => {
  console.log(`retrieveAllFromMail-.->${__MODULE_FILE__} `);
  //  console.log(objConn);
  const { clientPG, query } = objConn;

  let connection = clientPG();

  let log;
  let pop3Server = client;

  pop3Server.connect(function() {
    try {
      pop3Server.retrieveAll(function(err, messages) {
        if (!messages)
          return callBack({ message: "error not messages " }, null);
        //
        console.log(messages.length);
        log = messages.length;
        console.log("al for each " + log);
        _numero = 0;
        messages.reverse().forEach(async function(message) {
          try {
            if (!connection._connected && !connection._connecting)
              await connection.connect();
            let result = await connection.query(query, [message]);
            connection.end();
            console.log(result.rows[0].updateemails);
            if (result.rows[0].updateemails) _numero++;
          } catch (error) {
            if (error.message !== "Connection terminated") {
              pop3Server.quit();
              console.log(`error 157 ${error.stack}`);
              //    connection.end();
              callBack(error, null);
            }
          }
        });
        pop3Server.quit();
        callBack(null, { response: "ok", largo: log, updated: _numero });
      });
    } catch (err) {
      console.log(`error ppal 176 ${err.stack}`);
      if (connection._connected) connection.end();
      pop3Server.quit();
    }
  });
};
/* pepe */

const count = (callBack, lClose = false) => {
  client.connect(function() {
    client.count(callBack);
    if (lClose) {
      client.quit();
    }
  });
};

const retrieve = (nro, callback) => {
  // console.log(`retireve -->${__MODULE_FILE__} ${typeof callback}`);

  try {
    console.log("__!");
    if (client.connected) client.quit();
    client.connect(function() {
      console.log(`__!! ${nro}`);
      try {
        client.retrieve(nro, (err, msg) => {
          if (err) {
            console.log(err);
            callback(err, null);
          }
          console.log(msg);
          callback(null, msg);
        });
      } catch (error) {
        console.log(`${error.message}`);
      }
    });
  } catch (error) {
    console.error(`retrieve catch ->${__MODULE_FILE__}
    ${error.message}
    ${error.stack}`);
    client.quit();
    callback(error, null);
  } finally {
    client.quit();
  }
};
var result, contador, email;

const retrieveRef = async (ref, callBackHTTP) => {
  result = [];
  let pop3 = getClientNotParsed();
  //
  const _retrieveAll = pop => {
    pop.retrieveAll(messages => {
      let parser = new MailParser({ showAttachmentLinks: true });
      messages.forEach(async msg => {
        console.log(" parsing ");
        let mail = await parse(parser, msg);
        result.push(mail);
      });
    });
    return result;
  };

  let emails = await retrievePromess(pop3, ref, _retrieveAll);
  callBackHTTP(null, emails);
  return emails;
};

const retrieveRef2 = async (ref, callBack) => {
  console.log("RetrieveRef[pop-api]");
  let nlient = getClientNotParsed();
  console.log("RetrieveRef[0]");
  nlient.connect(err => {
    if (err) {
      console.log("error");
      console.log(err);
      callBack(err, null);
    }
    console.log("2");
    nlient.count(function(err, contador) {
      if (err) {
        console.log("error");
        console.log(err);
        callBack(err, null);
      }
      console.log("3");
      console.log(contador);

      for (let index = contador; index > 0; index--) {
        retrieve(nlient, index, async (err, msg) => {
          console.log(`index ${index}`);
          if (err) {
            console.log("error");
            console.log(err);
            callBack(err, null);
          }
          console.log(msg.messageId);
          if (msg.messageId === ref) {
            console.log("Lo encontroo");
            index = -999999;
            callBack(null, msg);
          }
        });
      }
      console.log("quit");
      callBack(null, "not Found");
      nlient.quit();
    });
  });
};

const retrieveLast = async (nro, fcallback) => {
  console.log("retrieveLast");
  console.log(nro);
  console.log(client.connected);
  if (!client.connected) client.connect();

  client.retrieve(nro, (err, messages) => {
    console.log("retrieve in call");
    if (err) {
      client.quit();
      fcallback(err, null);
    }
    client.quit();
    fcallback(null, messages);
  });
};

/* const pp = async (email) => {
  const item = await parse(new MailParser(), email);
  response.push(item);
}; */

module.exports = {
  retrieve,
  retrieveAllFromMail,
  retrieveNewFrom,
  retrieveLast,
  retrieveRef,
  count
};