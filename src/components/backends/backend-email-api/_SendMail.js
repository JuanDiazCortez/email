"use strict";
const pako = require("pako");
const { log } = require("console");
const nodemailer = require("nodemailer");
const printMail = require("../../constants");
const path = require("path");
const data = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

console.log(data);

const makeTo = (toList) => {
  console.log(`makeTo . --> ${JSON.stringify(toList, null, 2)}`);
  let result = "";

  for (let index = 0; index < toList.length; index++) {
    let item = toList[index].address;
    console.log(`item[${index}] ${item}`);
    let data = item.toString();
    if (index < toList.length) {
      data = data.concat(";");
    } else {
      data = data.concat(" ");
    }
    console.log(data);
    result += data;
  }

  console.log(`makeTo-->result ${result}`);
  return result;
};
// async..await is not allowed in global scope, must use a wrapper
async function sendMail(email, creds) {
  console.log(`sendMail->_SendMail.js `);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASSWD, // generated ethereal password
    },
  });

  function encodeMessage(message) {
    let enc = encodeURIComponent(message);
    let zlib = pako.deflate(enc);
    let binstring = convertUint8ArrayToBinaryString(zlib);
    let b64 = window.btoa(binstring);
    return b64;
  }
  function convertUint8ArrayToBinaryString(u8Array) {
    let b_str = "";
    for (let i = 0; i < u8Array.length; i++) {
      b_str += String.fromCharCode(u8Array[i]);
    }
    return b_str;
  }

  const makeAttachments = (attachments) => {
    console.log(`makeAttachments-->_SendMail.js`);
    let encode;
    let attachs = [];
    if (attachments.length === 0) return [];
    for (let index = 0; index < attachments.length; index++) {
      const attach = attachments[index];

      let { contentType, fileName, content, transferEncoding } = attach;
      let { data, type } = content;
      console.log(`contentType ${contentType}
                  transferEncoding: ${transferEncoding}`);
      encode = data;
      if (contentType === "base64") {
        encode = encodeMessage(data);
      }
      attachs.push({
        fileName,
        contentType,
        content: encode,
        encodding: transferEncoding,
      });
    }

    return attachs;
  };

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // console.log(transporter);
  console.log(JSON.stringify(email.attachments, null, 2));

  // send mail with defined transport object

  try {
    let info = await transporter.sendMail({
      from: '"Richelet & Richelet " <info@richelet.com.ar>', // sender address
      to: makeTo(email.to), // list of receivers
      subject: email.subject,
      text: email.text, // plain text body
      html: email.original, // html body
      attachments: email.attachments,
    });

    console.log("Message sent: %s", JSON.stringify(info));

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return info;
  } catch (error) {
    console.log(`error en envío1!! ${error.message} `);
    return error;
  }
}

module.exports = {
  sendMail,
};
