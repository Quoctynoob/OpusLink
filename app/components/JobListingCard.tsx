"use client";

import { JobListing } from "../types";

interface JobListingCardProps {
  job: JobListing;
}

export default function JobListingCard({ job }: JobListingCardProps) {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(date);
  };

  // Create a shorter description for the card preview
  const shortenDescription = (description: string, maxLength = 200) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {job.title}
        </h3>
        {job.salary_min && job.salary_max && (
          <span className="text-green-600 dark:text-green-400 font-medium">
            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {job.company?.display_name || "Company"}
          </span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <span>{job.location?.display_name || "Location not specified"}</span>
          <span className="mx-2">•</span>
          <span>{job.contract_time || "Not specified"}</span>
          {job.category?.label && (
            <>
              <span className="mx-2">•</span>
              <span>{job.category.label}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {shortenDescription(job.description)}
      </p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Posted: {formatDate(job.created)}
        </span>
        <a
          href={job.redirect_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
}