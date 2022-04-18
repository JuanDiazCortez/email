import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import TabPreferencias from "./TabPreferencias";

function Configuration({credenciales}) {
  return (
    <div className="div">
      <div style={{ display: "block", width: 700, padding: 30 }}>
        <h4>React-Bootstrap Tab Component</h4>
        <Tabs defaultActiveKey="second">
          <Tab eventKey="first" title="Preferencias">
            <TabPreferencias credenciales={credenciales}/>
          </Tab>
          <Tab eventKey="second" title="Setting">
            Hii, I am 2nd tab content
          </Tab>
          <Tab eventKey="third" title="Aboutus">
            Hii, I am 3rd tab content
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Configuration;
