"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobListProps } from "@/interfaces/JobsInterfaces";



export function JobList({ jobs, loading, onJobClick }: JobListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="col-span-1">
        <p>No jobs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card
          key={job.job_url}
          className="cursor-pointer hover:shadow-md transition-shadow border rounded-lg p-4 bg-white"
          onClick={() => onJobClick(job)}
        >
          <CardContent>
            {/* Job Title */}
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {job.job_title}
            </h3>

            {/* Company Name */}
            <p className="text-sm text-gray-600 mt-1">{job.company_name}</p>

            {/* Job Location */}
            <p className="text-sm text-gray-500 mt-1">
              {job.location}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
