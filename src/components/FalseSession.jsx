import { Link } from "react-router-dom";

function FalseSession() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <p
          className="u-center justify-center u-bold"
          style={{ fontSize: "40px" }}
        >
          You don't have the permissions to access this page.
        </p>

        <div>
          <Link to="/">
            <button className="button u-margin-32">Go Back</button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center absolute bottom-10 u-margin-32">
          <div className="loader"></div>
          <p className="u-color-text-info">
            P.S. Checking the current session in the background.
          </p>
          <br />
          <div class="tag is-info">
            <span class="icon-info" aria-hidden="true"></span>
            <span class="text">
              Make sure you have cookies enabled in your browser
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default FalseSession;
