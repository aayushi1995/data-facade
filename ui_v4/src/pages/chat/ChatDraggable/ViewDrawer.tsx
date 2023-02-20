import React from "react";
import './ViewDrawer.css'

const ViewDrawer = ({ cssDrawer, cssHandle }:any) => {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div>
        <div> Chat </div>
        <div> DeepDive </div>
      </div>
      <div className={cssDrawer}>
        <div className={cssHandle}></div>
      </div>
    </div>
  );
};

export default ViewDrawer;
