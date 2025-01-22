"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Job {
  id: number;
  job_title: string;
  company_name: string;
  job_url: string;
}

interface JobListProps {
  jobs: Job[];
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onJobClick: any;
}

export default function JobList({ jobs, loading, onJobClick }: JobListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onJobClick(job)}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold">{job.job_title}</h3>
            <p className="text-sm text-gray-600">{job.company_name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
