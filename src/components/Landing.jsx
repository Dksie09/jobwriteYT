import React from "react";
import image from "../assets/image.png";
import { account } from "../appwrite/Appwrite";

const currentURL = window.location.href;
const successURL = currentURL + "success";
const failureURL = currentURL + "failure";

function Landing() {
  async function githubOAuth() {
    account.createOAuth2Session("github", successURL, failureURL);
  }

  return (
    <>
      <div className="u-flex u-margin-32">
        <div style={{ width: "100px" }}></div>
        <div className="u-margin-32">
          <h1
            className="heading-level-1 u-cursor-pointer"
            style={{ fontSize: "40px" }}
          >
            JOB<span style={{ color: "rgb(240, 45, 101)" }}>WRITE</span>
          </h1>
          <div className="u-margin-32">
            <article
              className="u-margin-32 u-max-width-450"
              style={{ boxShadow: "var(--shadow-large)" }}
            >
              <br />
              <br />
              <br />
              <span className="u-bold" style={{ fontSize: "40px" }}>
                Find your ideal job with just one click
              </span>
              <br />
              <br />
              <p className="u-opacity-50">
                Our website utilizes a unique natural language processing model
                that understands your github profile with remarkable accuracy,
                enabling us to find the most relevant jobs for you.
              </p>
            </article>

            <div className="u-flex u-margin-32 u-column-gap-16 u-main-space-between">
              <button className="button" id="sign-up-btn" onClick={githubOAuth}>
                <span className="icon-github"></span>Get started
              </button>
              <span style={{ fontSize: "1.2vw" }}></span>
            </div>
          </div>
        </div>
        <div style={{ width: "10px" }}></div>
        <div className="">
          <img src={image} alt="girl image" style={{ width: "100%" }} />
        </div>
      </div>
      <br />
      <div className="u-flex u-margin-32 u-main-center">
        <div>
          <h1
            className="heading-level-1 u-cursor-pointer u-margin-32 u-max-width-100-percent "
            style={{ fontSize: "40px" }}
          >
            Our Features
          </h1>
        </div>
      </div>

      <div className="u-flex u-main-center">
        <div className="u-margin-32 card is-allow-focus">
          <div className="icon-heart u-text-center"></div>
          <h4 className="heading-level-5 u-text-center u-bold">
            We Value Your Needs
          </h4>
          <br />
          <h4 className="text u-text-center">
            Our website uses a unique natural language processing model that
            understands your preferences
          </h4>
          {/* </div> */}
          <div className="u-margin-32 card">
            <div className="icon-database">
              <span className="text u-text-center">Comprehensive database</span>
            </div>
            <br />
            <h4 className="">
              Extensive database of jobs openings, ensuring that users can find
              jobs that meet their unique skill set.
            </h4>
          </div>
          <div className="u-margin-32 card">
            <div className="icon-lightning-bolt">
              <span className="text u-text-center">Superfast Results</span>
            </div>
            <br />
            <h4 className="">
              Our website retrieves job information within seconds, providing a
              seamless and efficient user experience.
            </h4>
          </div>
          <div className="u-margin-32 card">
            <div className="icon-star">
              <span className="text u-text-center">
                Personalized match Score
              </span>
            </div>
            <br />
            <h4 className="">
              Our unique scoring system that evaluates job based on your
              personal profile.
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
