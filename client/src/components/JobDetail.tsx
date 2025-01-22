"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
//import { Skeleton } from "@/components/ui/skeleton"

interface JobDetail {
  id: number
  title: string
  company_name: string
  job_description: string
  requirements: string[]
}

export default function JobDetail({ job }: { job: JobDetail | null }) {

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
        <CardTitle>{job.title}</CardTitle>
        <p className="text-sm text-gray-600">{job.company_name}</p>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">Description</h4>
        <p className="mb-4">{job.job_description}</p>
        <h4 className="font-semibold mb-2">Requirements</h4>
        {/* <ul className="list-disc pl-5">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul> */}
      </CardContent>
    </Card>
  )
}

