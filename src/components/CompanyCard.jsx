import React from "react";

function CompanyCard(props) {
  const { job } = props;

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className=" w-full mx-auto my-4 p-4 rounded-lg shadow-lg"
    >
      <div className="flex card is-allow-focus items-center lg:flex-row flex-col justify-between mb-4">
        <img
          src={job.logo}
          alt="Company logo"
          className="w-12 h-12 rounded-full mr-4 mb-4 lg:mb-0"
        />
        <div>
          <h3 className="text-xl font-semibold">{job.job_title}</h3>
          <p className="sm:max-w-xs">{job.company_name}</p>
        </div>

        <hr className="my-4" />
        <div className="flex flex-wrap mb-4 justify-between">
          <div className="w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4">
            <p>
              <span className="icon-location-marker"></span>
              {job.location || "Placeholder location"}
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <p>
              <span className="icon-currency-rupee"></span>
              {job.stipend}
            </p>
          </div>
        </div>
        <div>
          <p className="line-clamp-4">{job.about_company}</p>
        </div>
        <div>
          <br />
          <div className="flex flex-wrap">
            {job.skills_reqd.split(",").map((skill) => (
              <div key={skill} className="tag mr-2 mb-2">
                {skill.trim()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}

export default CompanyCard;
