import {
 // getSentEmails,
  onRetrieveUrl2,
  URL_DATABASE,
  PORT_BACKEND
} from "../constants";

export const updateSpam = async (setSpam, credenciales) => {
  const result = await onRetrieveUrl2(
    `http://${URL_DATABASE}:${PORT_BACKEND}/retrieveForStatus`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cantidad: 20, credenciales, status: "spam" })
    }
  );

  console.log(result);
  setSpam(result.rows);
};

export const updateReaded = async (setReaderEmails, credenciales) => {
  const result = await onRetrieveUrl2(
    `http://${URL_DATABASE}:${PORT_BACKEND}/retrieveReaded`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cantidad: 20, credenciales })
    }
  );

  console.log(result);
  setReaderEmails(result.rows);
};
