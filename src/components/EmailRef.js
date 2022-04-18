import React from "react";

function EmailRef({ email }) {
  return <div>{email.references ? <h2>{email.references[0]}</h2> : null}</div>;
}

export default EmailRef;
