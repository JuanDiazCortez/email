import React, { useState } from "react";
import shortid from "shortid";
import Parser from "html-react-parser";

import "moment-timezone";
const { makeReduce } = require("./constants");
const NULL_DIV = null;
// import DocViewer, { PDFRenderer } from "react-doc-viewer";
const small = "fs-6";
function RenderAttach({ attach }) {
  //  console.log("render doc");
  //  console.log(attach);
  const {
    length,
    content,
    fileName,
    contentType,
    transferEncoding,
    generatedFileName,
  } = attach;

  const isIMG = (t) => {
    return (
      t === "image/jpeg" ||
      t === "image/png" ||
      t === "image/gif" ||
      t === "image/jpg"
    );
  };

  if (isIMG(contentType)) {
    return <div>{generatedFileName}</div>;
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
            className="clip-brow"
            href="javascript(0)"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            title="Click para bajar attach"
            style={{ color: "white" }}
          >
            {fileName ? fileName : generatedFileName}
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
                overflowy: "hidden",
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
                overflowy: "hidden",
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
                overflowy: "hidden",
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
          color: "white",
        }}
      >
        {showHeader ? "- hide header details" : "+ show header details"}
      </button>
      {showHeader && (
        <div id="ecomponent" className={`bg-dark.bg-gradient mt-2 ${small}`}>
          <div>
            <ul className="c3 list-unstyled">
              {to
                ? to.map((element, index) => (
                    <li key={shortid.generate()}>
                      <div className={` ${small} `}>
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
                      <div className={` ${small} `}>
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
              {cc &&
                cc.map((element, index) => (
                  <li key={shortid.generate()}>
                    <div className={` ${small} `}>
                      <p>
                        {index === 0 ? <b>cc: </b> : null}
                        {` ${element.name} ${element.address}`}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <p>
              <b>Fecha:</b>
              {` ${new Date(date).toLocaleDateString(
                navigator.language
              )}  ${new Date(date).toLocaleTimeString("es-AR", {
                hour12: false,
              })}`}
            </p>
          </div>

          <div className="d-flex flex-row fs-3">
            <b>Subject:</b>
            <p>{` ${subject}`}</p>
          </div>
        </div>
      )}
      <hr />
      <div id="xweerer" className="mt-4">
        {html2 &&
          validHTML(html2) &&
          Parser(html2, {
            trim: true,
            replace: (domNode) => {
              if (domNode.name && domNode.name === "img") {
                if (!attachments) return <div></div>;
                let attach = attachments.find(
                  (attach) => `cid:${attach.contentId}` === domNode.attribs.src
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
                      width: domNode.attribs.width,
                    }}
                  />
                );
              } else {
                if (domNode && domNode.type !== "text");
                //  console.log(domNode);
              }
              if (domNode.name && domNode.name === "o:p") {
                return <div></div>;
              }
              if (domNode.name && domNode.name === "li") {
                // console.log(domNode);
              }

              if (domNode.name && domNode.name === "html") return NULL_DIV;
            },
          })}
        {!html && (
          <textarea
            className={`p-1 ${small} ml-2 fw-normal`}
            readOnly={true}
            // rows={text.split("\n").length - 1}
            cols="120"
            style={{ minHeight: "68rem", backgroundColor: "#a6eff4" }}

            // maxlength={text.length}
          >
            {text}
          </textarea>
        )}
      </div>
      {attachments && (
        <div className="d-flex ">
          <h5>Attachments</h5>
          <ul className="lista">
            {attachments.map((attach) => (
              <li key={shortid.generate()}>
                <RenderAttach attach={attach} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EmailComponent;
