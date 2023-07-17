import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import FalseSession from "./FalseSession";
import { v4 as uuidv4 } from "uuid";
import { account, databases } from "../appwrite/Appwrite";

function Feedback() {
  const [user, setUser] = useState({
    isLoggedIn: true,
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    account
      .get()
      .then((response) => {
        setUser({
          isLoggedIn: response.status,
          email: response.email,
        });
      })
      .catch((error) => {
        console.error(error);
        setUser({ isLoggedIn: false });
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const feedbackText = event.target.elements.feedback.value;
    setSubmitted(true);
    savFeedback(feedbackText);
  };

  const savFeedback = (feedbackText) => {
    const promise = databases.createDocument(
        '64abb564c2097d744ba1',
        '64b4f9f7d16aadcc7b83',
      uuidv4(),
      {
        email: user.email,
        feedback: feedbackText,
      }
    );

    promise.then(
      function (response) {
        console.log(response); // Success
      },
      function (error) {
        console.log(error); // Failure
      }
    );
  };

  return (
    <>
      {user.isLoggedIn ? (
        <div className="flex min-h-screen">
          <Navbar />
          <div className="flex flex-col flex-grow">
            <Header />
            <br />
            <div className="box pl-4">
              <p className="pl-4 text-lg font-bold mb-4">
                Feedback{" "}
                <span style={{ color: "rgb(240, 45, 101)" }}>Matters!</span>✊
              </p>
              <p className="pl-4">
                We're all ears! Help us make our services even better for you by
                giving us your feedback. We want to know what's on your mind,
                what we're doing right, and what we need to work on. We promise
                to take your feedback seriously and use it to make you feel even
                more awesome when you use our services.
                <br />
                <br />
                <span style={{ color: "rgb(240, 45, 101)" }}>
                  So, whether it's salty or sweet, let us know what you're
                  thinking.
                </span>
              </p>
            </div>
            <div className="flex justify-center items-center h-full">
              {submitted ? (
                <p className="min-w-200px" style={{ color: "green" }}>
                  Thanks for your feedback!
                </p>
              ) : (
                <form
                  className="form u-width-full-line u-max-width-500"
                  onSubmit={handleSubmit}
                >
                  <ul className="form-list">
                    <li className="form-item">
                      <label className="label">Feedback:</label>
                      <textarea
                        className="input-text"
                        name="feedback"
                        placeholder="Can't wait to hear what you have to say!"
                      ></textarea>
                      <br />
                      <button className="button justify-center" type="submit">
                        Submit
                      </button>
                    </li>
                  </ul>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : (
        <FalseSession error={"Session not found"} />
      )}
    </>
  );
}

export default Feedback;
