import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import FalseSession from "./FalseSession";
import ScoreCard from "./ScoreCard";
import { account, databases, functions } from "../appwrite/Appwrite";

function Dashboard() {
  const [user, setUser] = useState({
    isLoggedIn: true,
    email: "",
  });
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalled, setIsCalled] = useState(false);

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

  //-----------browse jobs----------------
  const browseJobs = () => {
    setIsLoading(true);
    setIsCalled(true);
    const promise = functions.createExecution('64b42016a2110d7fbfdb', user.email);
    console.log("function called");

    promise
      .then(
        function (response) {
          console.log("function response");
          console.log(response); // Success
          const parsedResponse = JSON.parse(response.response).matched_docs;
          const promise2 = parsedResponse.map(async function (doc) {
            const documentId = doc[0];
            const score = doc[1];
            const response = await databases.getDocument(
              '64b016de0d3e5f5e9d47',
              '64b2646d1949f7a502b5',
              documentId
            );
            const documentData = response;
            documentData.score = score;
            return documentData;
          });
          Promise.all(promise2)
            .then(function (results) {
              console.log(results);
              setJobData(results); // Set the jobData state with the results
              setIsLoading(false); // Set loading state to false after setting jobData
            })
            .catch(function (error) {
              console.log(error); // Failure in getting document details
              setIsLoading(false); // Set loading state to false on error
            });
        },
        function (error) {
          console.log(error); // Failure in getting matching docs
          setIsLoading(false); // Set loading state to false on error
        }
      )
      .catch(function (error) {
        console.log(error); // Failure
      });
  };
  //--------------------------------------
  return (
    <>
      {user.isLoggedIn ? (
        <>
          <div className="flex min-h-screen">
            <Navbar />
            <div className="flex flex-col flex-grow">
              <Header />
              <br />
              <div className="box pl-4">
                <p className="pl-4 text-lg font-bold mb-4">
                  Welcome to the{" "}
                  <span style={{ color: "rgb(240, 45, 101)" }}>Dashboard!</span>
                  🤗
                </p>
                <p className="pl-4">
                  Discover a plethora of captivating job opportunities as you
                  effortlessly explore our jobs that are tailored to your
                  profile. Unleash the power of intuitive search and filtering
                  tools, allowing you to refine your quest for the perfect role
                  that resonates harmoniously with your unique skills and
                  passions. Embrace the potential of jobwrite and embark on a
                  remarkable journey towards personal and professional
                  fulfillment.
                </p>
                <div className="pl-4 pt-4">
                  <button className="button" onClick={browseJobs}>
                    <span className="icon-search"></span>Browse
                  </button>
                </div>
              </div>
              {isLoading && (
                <div className="u-flex-vertical justify-center items-center mt-4 text-center">
                  <br />
                  <p style={{ color: "rgb(240, 45, 101)" }}>
                    Hold on! We are fetching jobs for you.
                    <br />
                    First requests usually take time as the server is waking up.
                  </p>
                  <br />
                  <div className="loader"></div>
                </div>
              )}
              {!isLoading && isCalled && (
                <>
                  <p
                    className="pl-4 mt-4 font-bold mb-4 text-center"
                    style={{ color: "rgb(0, 128, 0)" }}
                  >
                    {" "}
                    Success! Here are some jobs that match your profile.
                  </p>
                  <div className="flex flex-wrap">
                    {jobData.map((job) => (
                      <div
                        key={job.$id}
                        className="w-full md:w-1/2 lg:w-1/3 p-4"
                      >
                        <ScoreCard job={job} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center items-center u-margin-32">
                    <button className="button">
                      <span className="icon-arrow-circle-down"></span>View more
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <FalseSession error={"Session not found"} />
      )}
    </>
  );
}

export default Dashboard;
