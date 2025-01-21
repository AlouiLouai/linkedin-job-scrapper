"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface JobDetail {
  id: number
  title: string
  company: string
  description: string
  requirements: string[]
}

export default function JobDetail() {
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setJob({
        id: 1,
        title: "Software Engineer",
        company: "Tech Co",
        description: "We are looking for a talented Software Engineer to join our team...",
        requirements: [
          "5+ years of experience in web development",
          "Proficiency in React and Node.js",
          "Strong problem-solving skills",
        ],
      })
      setLoading(false)
    }, 2000)
  }, [])

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (!job) {
    return (
      <Card className="col-span-2">
        <CardContent>
          <p className="text-center py-8">Select a job to view details</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <p className="text-sm text-gray-600">{job.company}</p>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">Description</h4>
        <p className="mb-4">{job.description}</p>
        <h4 className="font-semibold mb-2">Requirements</h4>
        <ul className="list-disc pl-5">
          {job.requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

