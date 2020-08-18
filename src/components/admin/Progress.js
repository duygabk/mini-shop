import React from "react";

function Progress(props) {
  const { percent } = props;
  return (
    <div className="progress" style={{ height: 30 }}>
      <div
        className="progess-bar bg-info progress-bar-striped progress-bar-animated"
        style={{ width: `${percent}%`, height: 30, lineHeight: "30px" }}
      >{`  ${percent}%`}</div>
    </div>
  );
}

export default Progress;
