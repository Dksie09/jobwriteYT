import React, { useState, useEffect } from "react";
import { account, databases, functions } from "../appwrite/Appwrite";
import FalseSession from "./FalseSession";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";

export default function Success() {

  const navigate = useNavigate();
  const [user, setUser] = useState({
    isLoggedIn: false,
    email: "",
  });

  useEffect(() => {
    account
      .get()
      .then((response) => {
        setUser({
          isLoggedIn: true,
          email: response.email,
        });
        const email = response.email;
          const promise = account.getSession("current");

          promise.then(
            function (response) {
              const token = response.providerAccessToken;
              //execute the function
              console.log("function called");
              const promise = functions.createExecution(
                "64ab93b762edd1f11955",
                token
              );
              promise.then(
                function (response) {
                  console.log(user);
                  const result = JSON.parse(response.response);
                  console.log(result);
                  const promise = databases.updateDocument(
                    "64abb564c2097d744ba1",
                    "64abb57133827f365cbd",
                    result.username,
                    {
                      languages: JSON.stringify(result.languages),
                      readme: result.readme_text,
                      avatarURL: result.avatar_url,
                      name: result.name,
                      username: result.username,
                      email: email,
                    }
                  );

                  promise.then(
                    function (resp) {
                      console.log(resp); // Success
                      navigate("/dashboard");
                    },
                    function (error) {
                      const promise = databases.createDocument(
                        "64abb564c2097d744ba1",
                        "64abb57133827f365cbd",
                        result.username,
                        {
                          languages: JSON.stringify(result.languages),
                          readme: result.readme_text,
                          avatarURL: result.avatar_url,
                          name: result.name,
                          username: result.username,
                          email: email,
                        }
                      );

                      promise.then(
                        function (resp) {
                          console.log(resp); // Success
                          navigate("/dashboard");
                        },
                        function (error) {
                          console.log(error); // Failure
                        }
                      );
                    }
                  );
                },
                function (error) {
                  console.log(error); // Failure
                }
              );
            },
            function (error) {
              console.log(error); // Failure
            }
          );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  return (
    <>
      {user.isLoggedIn ? (
        <div className="h-screen flex flex-col justify-center items-center">
          loading...
        </div>
      ) : (
        <>
          <FalseSession />
        </>
      )}
    </>
  );
}
