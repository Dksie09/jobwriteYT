import React from "react";

function Header() {
  return (
    <div className="header">
      <div className="text-left pt-4 pl-4">
        <a href="/">
          <h1
            className="heading-level-1 cursor-pointer"
            style={{ fontSize: "40px" }}
          >
            JOB<span style={{ color: "rgb(240, 45, 101)" }}>WRITE</span>
          </h1>
        </a>
      </div>
      <hr className="my-4 w-full" />
    </div>
  );
}

export default Header;
