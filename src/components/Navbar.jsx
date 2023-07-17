import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import { account, databases } from "../appwrite/Appwrite";

function Navbar(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    avatarUrl: "",
    username: "",
    name: "",
    email: "",
  });

  //------------fetch userInfo----------------
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await account.get();
        const email = response.email;

        console.log(email);
        // Fetch document based on email
        const documentResponse = await databases.listDocuments(
          "64abb564c2097d744ba1",
          "64abb57133827f365cbd",
          [Query.equal("email", email)]
        );

        if (documentResponse.total > 0) {
          const document = documentResponse.documents[0];

          setUserInfo({
            avatarUrl:
              document.avatarURL ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            username: document.username || "",
            name: document.name || "",
            email: document.email || "",
          });
        } else {
          console.log("No documents found");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);
  //------------------------------------------

  return (
    <>
      <div className="h-full border-r border-gray-300  min-h-screen">
        <div className="flex flex-col items-center py-8 px-6 w-72 pt-...pt-20">
          <img
            src={userInfo.avatarUrl}
            // src={props.avatarUrl}
            alt="Avatar"
            className="w-40 h-40 rounded-full mb-6"
          />
          <div className="u-flex u-column-gap-8">
            <div className="text-xl font-bold mb-4 pt-5">
              {userInfo.username}
            </div>
            <button class="tooltip" aria-label="variables info">
              <span class="icon-pencil-alt" aria-hidden="true"></span>
              <span class="tooltip-popup" role="tooltip">
                Edit username
              </span>
            </button>
          </div>
          <div className="text-gray-400 text-sm mb-1">{userInfo.name}</div>
          <div className="text-gray-600 text-sm mb-6">{userInfo.email}</div>
        </div>
        <div className="flex-grow">
          {/* your content here */}
          <section className="drop-section">
            <ul className="drop-list">
              <li className="drop-list-item">
                <NavLink
                  exact
                  to="/dashboard"
                  className={`drop-button py-2 px-4 ${
                    location.pathname === "/dashboard" ? "is-selected" : ""
                  }`}
                >
                  <span className="icon-home" aria-hidden="true"></span>
                  <span className="text text-lg">Dashboard</span>
                </NavLink>
              </li>
              <li className="drop-list-item">
                <NavLink
                  to="/allJobs"
                  className={`drop-button py-2 px-4 ${
                    location.pathname === "/allJobs" ? "is-selected" : ""
                  }`}
                >
                  <span className="icon-view-list" aria-hidden="true"></span>
                  <span className="text text-lg">All jobs</span>
                </NavLink>
              </li>
              <li className="drop-list-item">
                <NavLink
                  exact
                  to="/feedback"
                  className={`drop-button py-2 px-4 ${
                    location.pathname === "/feedback" ? "is-selected" : ""
                  }`}
                >
                  <span className="icon-pencil-alt" aria-hidden="true"></span>
                  <span className="text text-lg">Feedback</span>
                </NavLink>
              </li>
              <li className="drop-list-item">
                <a
                  className="drop-button py-2 px-4"
                  onClick={async () => {
                    try {
                      await account.deleteSession("current");
                      navigate("/");
                      console.log("logout success");
                    } catch (error) {
                      console.log("error:", error);
                    }
                  }}
                >
                  <span className="icon-logout-left" aria-hidden="true"></span>
                  <span className="text text-lg">Log out</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

export default Navbar;
