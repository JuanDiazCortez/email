const __MODULE_FILE__ = "BACKEND-EMAIL-API";
const Client = require("node-poplib-yapc").Client;
const MailParser = require("mailparser-mit").MailParser;
const fs = require("fs");
const { saveMailToDb } = require("../backend-postgres-api/postgresql");
const dotenv = require("dotenv");
const config = dotenv.config({ path: "../.env" });
console.log(config);
const path = require("path");
const data = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

var _numero = 0;
const mailparser = new MailParser();
mailparser.on("end", function (mail_object) {
  console.log("end parser");
  console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
  console.log("Subject:", mail_object.subject); // Hello world!
  console.log("Text body:", mail_object.text); // How are you today?
});

const getClient = () => {
  const client = new Client({
    hostname: process.env.EMAIL_URL,
    port: process.env.EMAIL_PORT_CLIENT,
    tls: true,
    mailparser: true,
    parserOptions: { mailParser: mailparser, showAttachmentLinks: false },
    username: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWD,
    // debug: true,
  });
  client.on("error", (e) => console.error(`Error en client ${e}`));
  return client;
};

const getClientNotParsed = () => {
  return new Client({
    hostname: process.env.EMAIL_URL,
    port: 995,
    tls: true,
    debug: false,
    mailparser: false,
    parserOptions: { showAttachmentLinks: false },
    username: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWD,
  });
};

const parse = async (parser, email) => {
  return new Promise((resolve, reject) => {
    parser.on("end", function (element) {
      resolve(element);
    });

    parser.on("error", function (err) {
      reject(err);
    });

    parser.write(email);
    parser.end();
  });
};

const retrievePromess = async (popServer, callback) => {
  //
  return new Promise((resolve, reject) => {
    popServer.on("data", function (data) {
      console.log("resolve data ");
      resolve(data);
    });

    popServer.on("error", function (error) {
      console.log("resolve error");
      reject(error);
    });

    popServer.connect((err) => {
      if (err !== null) return callback(err, null);
      callback(popServer);
    });
  });
};

const retrieveNewFrom = (messageID, receiveDate, callBack) => {
  retrieveLast(50, function (error, result) {
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
  console.log(`saveEmailToDb->${__MODULE_FILE__}`);
  let conn = fConn();
  let retVal;
  /* postgres */
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
const serie = (stop) => {
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
    pop3Server.connect(function (err) {
      if (err !== null) return callBack(err, null);
      count((error, cantidad) => {
        if (error) console.log(error);
        console.log(cantidad);

        retrieve(714, (err, res) => {
          console.log(res);
        });

        _numero = 0;
        let salir = false;
        for (let index = cantidad; index > 0; index--) {
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
              updated: _numero,
            });

            console.log("333333");
            pop3Server.quit();
            // connection.end();
            console.log("**********");
            return callBack(null, {
              response: "ok",
              largo: log,
              updated: _numero,
            });
          }); // RETRIEVE
          break;
        } // for
        console.log("salioo 0000000000000000000000");
        return callBack(null, {
          response: "ok",
          largo: log,
          updated: _numero,
        });
      }, false);
    }); //count
  } catch (error) {
    console.log("erorrrrrrrrrrrrrrrrrrrrrr");
  }
};

function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case "number":
          bytes += 8;
          break;
        case "string":
          bytes += obj.length * 2;
          break;
        case "boolean":
          bytes += 4;
          break;
        case "object":
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === "Object" || objClass === "Array") {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
    else return (bytes / 1073741824).toFixed(3) + " GiB";
  }

  return formatByteSize(sizeOf(obj));
}

const dumpMessages = (messages) => {
  for (let index = 0; index < messages.length; index++) {
    const element = messages[index];
    if (element !== undefined) {
      let name = element.messageId;
      //  fs.unlink(`/home/mongo/almacen/${name}.sql`, (err) => {});
      fs.writeFile(
        `/home/mongo/almacen/${name}.sql`,
        JSON.stringify(element),
        function (err) {
          if (err) {
            return console.log(err);
          }
          //   console.log(`The file was /home/mongo/almacen/${name}.sql saved!`);
        }
      );
    } else {
      console.log(`null en messages at index ${index}`);
    }
  }
};
// var sizeOfStudentObject = memorySizeOf({Student: {firstName: 'firstName', lastName: 'lastName', marks: 10}});
// console.log(sizeOfStudentObject);

const retrieveAllFromMail = (objConn, callBack) => {
  console.log(`retrieveAllFromMail-->${__MODULE_FILE__} `);

  const { clientPG, query } = objConn;

  let connection = clientPG();
  let log = 0;
  let jRes = { response: "", largo: log, updated: 0 };
  let pop3Server = getClient();
  try {
    pop3Server.connect((e) => {
      if (e) return callBack(e, null);

      pop3Server.retrieveAll(async function (err, messages) {
        if (err) {
          return callBack(err, null);
        }
        jRes.largo = messages.length;
      //  dumpMessages(messages);

        //   console.log(messages[0]);
        if (!messages)
          return callBack({ message: "error not messages " }, null);
        //
        console.log(messages.length);
        log = messages.length;
        console.log(`al for each  ${log}`);
        await connection.connect();

        for (let index = 0; index < messages.length; index++) {
          let error = false;
          const message = messages[index];
          if (message === null || message === undefined) continue;
          // console.log(memorySizeOf(message));

          if (index > 0 && index % 10 == 0) {
            //     console.log("----");
            await connection.end();
            await connection.end();
            connection = null;
            connection = clientPG();
            await connection.connect();
          }

          try {
            //

            let result = await connection.query(query, [message]);
            //         console.log("2");
            if (index === 0)
              console.log(` update[0]==> ${result.rows[0].updateemails}`);

            if (result.rows[0].updateemails) {
              jRes.updated = jRes.updated + 1;
              console.log("3+");
            }
            //   console.log("2*'");
          } catch (error) {
            pop3Server.quit();
            await connection.end();

            console.log(`error 157 ${error.stack}`);
            throw new Error(error);
          }
          //         console.log("4");
          //     console.log(`index ${index}`);
        } //for
        //  console.log(`fin de sincro ${JSON.stringify(jRes)}`);
        try {
          await connection.end();
        } catch (error) {}
        callBack(null, jRes);
      }); //retrieveall
    }); //connect pop3
  } catch (error) {
    pop3Server.quit();
    connection.end();
    console.log(`error 258 ${error.stack}`);
    callBack(error, null);
  }
}; // fin

const count = async (callBack) => {
  console.log(`count ${__MODULE_FILE__}`);
  let client;

  client = getClient();

  client.on("error", (e) => {
    return callBack(e, null);
  });

  client.connect((e) => {
    if (e) {
      console.log(e);
      return callBack(e, null);
    }
    client.count(callBack);
  });
};

const retrieve = (nro, callback) => {
  console.log(`retireve -->${__MODULE_FILE__}`);
  //
  let client = getClient().catch((e) => {
    callback(e, null);
  });
  //
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
  const _retrieveAll = (pop) => {
    pop.retrieveAll((messages) => {
      let parser = new MailParser({ showAttachmentLinks: true });
      messages.forEach(async (msg) => {
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

const retrieveLast = async (nro, fcallback) => {
  console.log(`retrieveLast->${__MODULE_FILE__}`);
  console.log(nro);
  let client = getClient();

  client.retrieve(nro, (err, messages) => {
    console.log("retrieve in call");
    if (err) {
      fcallback(err, null);
    }
    fcallback(null, messages);
  });
  client.quit();
};

module.exports = {
  retrieve,
  retrieveAllFromMail,
  retrieveNewFrom,
  retrieveLast,
  retrieveRef,
  count,
};
