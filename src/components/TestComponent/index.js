import React from "react";

function TestComponent(props) {
  console.log(props);
  return (
    <div horizontal>
      <div>You can use a Pane component</div>

      <div>Using a Pane allows you to specify any constraints directly</div>
    </div>
  );
}

export default TestComponent;
