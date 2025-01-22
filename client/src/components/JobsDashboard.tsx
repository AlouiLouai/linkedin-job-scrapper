"use client";

import { useState } from "react";
import FilterNavbar from "./FilterNavbar";
import { JobList } from "./JobList";
import { JobDetail } from "./JobDetail";

export function JobDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchJobs = async (filters: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetch_jobs", {
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
      setJobs([]); // Clear jobs on error
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleJobClick = (job: any) => {
    setSelectedJob(job); // Set selected job when clicked
  };

  return (
    <>
      <FilterNavbar onSubmitFilters={fetchJobs} />
      <div className="grid grid-cols-3 gap-4 p-4">
        <JobList jobs={jobs} loading={loading} onJobClick={handleJobClick} />
        <JobDetail job={selectedJob} />
      </div>
    </>
  );
}
