import React, { useState } from "react";
import shortid from "shortid";
import Parser from "html-react-parser";

import "moment-timezone";
const { makeReduce } = require("./constants");
// import DocViewer, { PDFRenderer } from "react-doc-viewer";

function RenderAttach({ attach }) {
  console.log("render doc");
  //  console.log(attach);
  const {
    length,
    content,
    checksum,
    fileName,
    contentType,
    transferEncoding,
    generatedFileName
  } = attach;

  const isIMG = (t) => {
    return (
      contentType === "image/jpeg" ||
      contentType === "image/png" ||
      contentType === "image/gif" ||
      contentType === "image/jpeg"
    );
  };

  if (isIMG(contentType)) {
    return <div></div>;
  }

  return (
    <div className="container">
      {isIMG(contentType)}
      <hr />
      <p>length:{length}</p>
      <p>fileName:{fileName ? fileName : generatedFileName}</p>
      {generatedFileName && generatedFileName.includes("eml") ? (
        <div>
          <a
            href="#"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Click para bajar attach"
            style={{ color: "white" }}
          >
            {generatedFileName}
          </a>
          <button className="ml-1" style={{ marginLeft: "8px" }}>
            click download
          </button>
        </div>
      ) : null}
      <p>contentType:{contentType}</p>
      <div>
        <div className="d-flex flex-column ">
          {contentType === "application/pdf" ? (
            <embed
              className="d-flex w-100"
              src={`data:${contentType};${transferEncoding},${makeReduce(
                content.data
              )}`}
              type="application/pdf"
              style={{
                width: "100%",
                heigth: "100% ",
                minWidth: "100rem",
                minHeight: "40rem",
                overflowx: "hidden",
                overflowy: "hidden"
              }}
              allowFullScreen
            />
          ) : null}
        </div>
        <div>
          {contentType === "application/msword" ? (
            <embed
              className="d-flex w-100"
              src={`data:${contentType};${transferEncoding},${makeReduce(
                content.data
              )}`}
              type="application/msword"
              style={{
                width: "100%",
                heigth: "100% ",
                overflowx: "hidden",
                overflowy: "hidden"
              }}
              allowFullScreen
            />
          ) : null}
        </div>
        <div>
          {contentType === "application/x-iso9660-image" ? (
            <img
              className="d-flex w-100"
              src={`data:${contentType};${transferEncoding},${makeReduce(
                content.data
              )}`}
              alt="rendere"
              type="application/x-iso9660-image"
              style={{
                width: "100%",
                heigth: "100% ",
                overflowx: "hidden",
                overflowy: "hidden"
              }}
            />
          ) : null}
        </div>
      </div>
    </div> // renderimg
  );
}

const validHTML = (html) => {
  if (!html) return false;

  return html.indexOf("div") > 0 || html.indexOf("<body") > 0;
};
function RenderedImage({ id, source, alt, stilo }) {
  //   console.log(source);
  return <img id={id} src={source} alt={alt} style={stilo} />;
}
function EmailComponent({ data, name }) {
  const { html, from, date, subject, to, cc, text, attachments } = data;
  const [showHeader, setShowHeader] = useState(false);

  const clearHtml = (h) => {
    if (!h) return "";
    let result = h.replace("\n", "");
    let final = result.replace("\t", "");
    return final;
  };
  let html2 = clearHtml(html);
  // console.log(html2);
  // console.log(attachments);

  return (
    <div className={name}>
      <button
        onClick={(ev) => {
          setShowHeader(!showHeader);
        }}
        style={{
          backgroundColor: "grey",
          color: "white"
        }}
      >
        {showHeader ? "- hide header details" : "+ show header details"}
      </button>
      {showHeader && (
        <div id="ecomponent" className="bg-dark.bg-gradient mt-2 fs-4">
          <div>
            <ul className="list-unstyled">
              {to
                ? to.map((element, index) => (
                    <li key={shortid.generate()}>
                      <div className="fs-4">
                        <p>
                          {index === 0 ? <b>To:</b> : null}
                          {` ${element.name} ${element.address}`}
                        </p>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </div>

          <div>
            <ul className="list-unstyled">
              {from
                ? from.map((element, index) => (
                    <li key={shortid.generate()}>
                      <div className="fs-4">
                        <p>
                          {index === 0 ? <b>from:</b> : null}
                          {` ${element.name} ${element.address}`}
                        </p>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </div>
          <div>
            <ul className="list-unstyled">
              {cc
                ? cc.map((element, index) => (
                    <li key={shortid.generate()}>
                      <div className="fs-4">
                        <p>
                          {index === 0 ? <b>cc: </b> : null}
                          {` ${element.name} ${element.address}`}
                        </p>
                      </div>
                    </li>
                  ))
                : null}
            </ul>
          </div>
          <div>
            <p>
              <b>Fecha:</b>
              {` ${new Date(date).toLocaleDateString(
                navigator.language
              )}  ${new Date(date).toLocaleTimeString("es-AR", {
                hour12: false
              })}`}
            </p>
          </div>
          {/* <br /> */}

          <div className="d-flex flex-row fs-3">
            <b>Subject:</b>
            <p>{` ${subject}`}</p>
          </div>
        </div>
      )}
      <hr />
      <div id="xweerer" className="mt-4">
        {html2 && validHTML(html2)
          ? Parser(html2, {
              trim: true,
              replace: (domNode) => {
                if (domNode.name && domNode.name === "img") {
                  if (!attachments) return null;
                  let attach = attachments.find(
                    (attach) =>
                      `cid:${attach.contentId}` === domNode.attribs.src
                  );
                  if (!attach) {
                    return null;
                  }
                  let source = `data:${attach.contentType};${
                    attach.transferEncoding
                  },${makeReduce(attach.content.data)}`;

                  return (
                    <RenderedImage
                      id={domNode.attribs.id}
                      source={source}
                      alt={domNode.attribs.src}
                      stilo={{
                        height: domNode.attribs.heigt,
                        width: domNode.attribs.width
                      }}
                    />
                  );
                } else {
                  if (domNode && typeof domNode !== "Text");
                  // console.log(domNode);
                }
                if (domNode.name && domNode.name === "o:p") {
                  return null;
                }
                if (domNode.name && domNode.name === "li") {
                  // console.log(domNode);
                }
                if (domNode.name && domNode.name === "html") return null;
              }
            })
          : null}
        {!html ? (
          <textarea
            className="p-1 fs-4 ml-2 fw-normal"
            readOnly={true}
            // rows={text.split("\n").length - 1}
            cols="120"
            style={{ minHeight: "68rem", backgroundColor: "#a6eff4" }}

            // maxlength={text.length}
          >
            {text}
          </textarea>
        ) : null}
      </div>
      {attachments ? (
        <div className="d-flex ">
          <h5>Attachments</h5>
          <ul>
            {attachments.map((attach) => (
              <li>
                <RenderAttach attach={attach} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default EmailComponent;
