"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Job {
  id: number
  title: string
  company: string
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setJobs([
        { id: 1, title: "Software Engineer", company: "Tech Co" },
        { id: 2, title: "Product Manager", company: "Startup Inc" },
        { id: 3, title: "Data Scientist", company: "Big Data Corp" },
      ])
      setLoading(false)
    }, 1500)
  }, [])

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
    )
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

