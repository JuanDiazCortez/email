const { onRetrieveUrl2, URL_DATABASE, PORT_BACKEND } = require("../constants");

export async function getEmails(cantidad, credenciales) {
  const r = await onRetrieveUrl2(
    `http://${URL_DATABASE}:${PORT_BACKEND}/retrieveLast`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cantidad: cantidad,
        credenciales: credenciales,
      }),
    }
  );
  console.log(r[0]);
  return r;
}
