import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import CompanyCard from "./CompanyCard";
import Header from "./Header";
import { Query } from "appwrite";
import { account, databases } from "../appwrite/Appwrite";
import FalseSession from "./FalseSession";

function AllJobs() {
    const [user, setUser] = useState({
        isLoggedIn: true,
        email: "",
      });
      const [selectedTag, setSelectedTag] = useState("All");
      const [info, setInfo] = useState([]);
      const [loader, setLoader] = useState(false);
    
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
    
      useEffect(() => {
        if (selectedTag === "All") {
          fetchData([Query.orderDesc("$updatedAt")]);
        }
      }, []);
    
      const fetchData = (query) => {
        setLoader(true);
        const getJob = databases.listDocuments(
          '64b016de0d3e5f5e9d47',
          '64b2646d1949f7a502b5',
          query
        );
    
        getJob
          .then((response) => {
            const data = response.documents;
            setInfo([...data]);
            setLoader(false);
            console.log(data);
          })
          .catch((error) => {
            console.log(error.message);
          });
      };
    
      const handleClick = (tag, query) => {
        setSelectedTag(tag);
        fetchData(query);
      };
    
      const filterButtons = [
        {
          tag: "All",
          query: [Query.orderDesc("$updatedAt")],
          icon: "icon-view-list",
          text: "All",
        },
        {
          tag: "stipend",
          query: [
            Query.orderDesc("stipend"),
            Query.notEqual("stipend", "Unpaid"),
          ],
          icon: "icon-currency-rupee",
          text: "stipend",
        },
        {
          tag: "workFromHome",
          query: [Query.equal("location", "Work From Home")],
          icon: "icon-home",
          text: "Work from home",
        },
      ];
    
      return (
        <>
          {user.isLoggedIn ? (
            <>
              <div className="flex min-h-screen">
                <Navbar />
                <div className="flex flex-col flex-grow">
                  <Header />
                  <br />
                  {loader && (
                    <div className="flex flex-col items-center justify-center">
                      <p>Loading data...</p>
                      <br />
                      <div className="loader"></div>
                    </div>
                  )}
                  {!loader && (
                    <>
                      <div className="u-flex u-column-gap-16 u-margin-32">
                        <div className="tag w-30 ">Filters</div>
                        <p className="text-xl">:</p>
                        {filterButtons.map((button) => (
                          <a key={button.tag}>
                            <div
                              className={`tag w-30 ${
                                selectedTag === button.tag
                                  ? "is-info"
                                  : "hover:bg-[rgb(4,50,57)]"
                              }`}
                              onClick={() => handleClick(button.tag, button.query)}
                            >
                              <span className={button.icon}></span>
                              {button.text}
                            </div>
                          </a>
                        ))}
                      </div>
                      <div
                        className="flex flex-wrap
    "
                      >
                        {info.map((job) => (
                          <div
                            key={job.id}
                            className="w-full md:w-1/2 lg:w-1/3 p-4"
                          >
                            <CompanyCard job={job} />
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

export default AllJobs