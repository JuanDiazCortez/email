import {
  faExclamationCircle,
  faMailBulk,
  faTrashAlt,
  faThumbsUp,
  faPastafarianism,
  faEnvelopeOpen,
  faArrowDown,
  faPaperclip,
  faReply,
} from "@fortawesome/free-solid-svg-icons";
import { Status, makeReduce } from "../constants";

/*



*/

export const isIMG = (attach) => {
  return (
    attach.contentType !== "image/png" &&
    attach.contentType !== "image/jpeg" &&
    attach.contentType !== "image/gif"
  );
};

export const onClickDownLoadAttach = (ev, attach) => {
  const { target } = ev;
  const { contentType, content, transferEncoding } = attach;
  console.log(ev.target);
  console.log(attach);
  const dataUrl = `data:${contentType};${transferEncoding},${makeReduce(
    content.data
  )}`;
  // alert(dataUrl);
  
  //  target.href = dataUrl;
  target.setAttribute("download", `${attach.fileName} `);
  var win = window.open(dataUrl, '_blank');
  win.focus();
};

export const getBorderForState = (state) => {
  switch (state) {
    case "reenviado":
      return "border border-warning  border-2";
      break;

    default:
      return "";
      break;
  }
};

const trimBlanks = (st) => st.replace(/ /g, "");

/* const onClickOverRow = (ev, email) => {
    console.log("onClickOverRow");

    let content = ev.target.textContent;
    if (email.references === undefined || email.references.length === 0) return;
    let root = document.getElementById(`child-${email.messageId}`);
    root.className = "card";
    root.style = "width: 148rem;heigth:80%";
    if (root === null) return console.log("no encuentra el div");

    if (content === "+") {
      ev.target.innerHTML = "-";
      ReactDOM.render(
        <EmailCard email={email} />,
        document.getElementById(`child-${email.messageId}`)
      );
    } else {
      ev.target.innerHTML = "+";
      ReactDOM.unmountComponentAtNode(
        document.getElementById(`child-${email.messageId}`)
      );
    }
  };
 */

export const searchStatus = (email) => {
  let resp = [];
  if (email.leido) resp.push("leido");
  try {
    resp.push(Status[email.state].print());
  } catch (error) {
    console.log(email.state);
    resp.push("reenviado");
  }
  return resp;
};

export const getIconFromName = (name) => {
  // console.log(name);
  switch (trimBlanks(name)) {
    case "faExclamationCircle":
      return faExclamationCircle;
    case "faMailBulk":
      return faMailBulk;
    case "faTrashAlt":
      return faTrashAlt;
    case "faThumbsUp":
      return faThumbsUp;
    case "faPastafarianism":
      return faPastafarianism;
    case "faEnvelopeOpen":
      return faEnvelopeOpen;
    case "faArrowDown":
      return faArrowDown;
    case "faPaperclip":
      return faPaperclip;
    case "faReply":
      return faReply;
    default:
      console.error("icon no encontrado " + JSON.stringify(name));
      break;
  }
};
