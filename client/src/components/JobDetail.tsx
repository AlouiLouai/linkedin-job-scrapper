"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/interfaces/JobsInterfaces";

export function JobDetail({
  job,
  loading,
}: {
  job: Job | null;
  loading: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    // Skeleton for loading state
    return (
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-20 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-5 w-24" />
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return (
      <Card className="col-span-2">
        <CardContent>
          <p className="text-center py-8">Select a job to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        {/* Company Logo or Image */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex justify-center items-center text-white">
            <span className="text-xl font-semibold">{job.company_name[0]}</span>
          </div>
          <div>
            <CardTitle>{job.job_title}</CardTitle>
            <p className="text-sm text-gray-600">{job.company_name}</p>
          </div>
        </div>

        {/* Job Location */}
        <p className="text-sm text-gray-500">{job.location}</p>
      </CardHeader>

      <CardContent>
        {/* Job Description */}
        <h4 className="font-semibold text-lg mb-2">Job Description</h4>
        <p className={`mb-4 ${isExpanded ? "" : "line-clamp-3"}`}>
          {job.job_description}
        </p>

        {/* Read More / Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:underline"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>

        {/* External URL for applying */}
        <div className="mt-4">
          <a
            href={job.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            Apply for this job
          </a>
        </div>

        {/* Additional info such as company link */}
        <div className="mt-4">
          <a
            href={job.company_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            Visit Company Website
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
