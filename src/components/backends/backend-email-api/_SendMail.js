"use strict";
const nodemailer = require("nodemailer");

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
  console.log(`sendMail->_SendMail.js ${JSON.stringify(email, null, 2)}`);
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mr.fibercorp.com.ar",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "info@richelet.com.ar", // generated ethereal user
      pass: "RR%%1info" // generated ethereal password
    }
  });

  // console.log(JSON.stringify(email.to, null, 2));

  // send mail with defined transport object
  try {
    let info = await transporter.sendMail({
      from: '"Richelet & Richelet " <info@richelet.com.ar>', // sender address
      to: makeTo(email.to), // list of receivers
      subject: email.subject,
      text: "Prueba correo desde app?", // plain text body
      html: "<b>Hola Fer ya mando correos desde el codigo!!!</b>" // html body
    });

    console.log("Message sent: %s", JSON.stringify(info));
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    return info;
  } catch (error) {
    console.log(`error en envío ${error.message} `);
    return error;
  }
}

// main().catch(console.error);
module.exports = {
  sendMail
};
