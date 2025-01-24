"use client";

import { useState } from "react";
import FilterNavbar from "./FilterNavbar";
import { JobList } from "./JobList";
import { JobDetail } from "./JobDetail";

export function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch jobs directly from Flask API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchJobs = async (filters: any) => {
    setLoading(true);
    try {
      const response = await fetch("https://linkedin-job-scrapper.onrender.com/fetch_jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data.jobs); // Assuming the API returns `{ jobs: [...] }`
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleJobClick = (job: any) => {
    setSelectedJob(job);
  };

  return (
    <>
      <FilterNavbar onSubmitFilters={fetchJobs} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div className="overflow-y-auto max-h-[700px] col-span-1">
          <JobList jobs={jobs} loading={loading} onJobClick={handleJobClick} />
        </div>
        <div className="overflow-y-auto max-h-[700px] col-span-1 md:col-span-2">
          <JobDetail loading={loading} job={selectedJob} />
        </div>
      </div>
    </>
  );
}
