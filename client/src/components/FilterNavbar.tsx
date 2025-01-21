"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function FilterNavbar() {
  const [filters, setFilters] = useState({
    search_term: "",
    location: "",
    site: "",
    results_wanted: 0,
    distance: 0,
    job_type: "",
    country: "",
    batch_size: 0,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Filters submitted:", filters)
    // Here you would typically call an API or update the app state
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 mb-4">
      <div className="grid grid-cols-4 gap-4">
        <Input name="search_term" placeholder="Search term" value={filters.search_term} onChange={handleInputChange} />
        <Input name="location" placeholder="Location" value={filters.location} onChange={handleInputChange} />
        <Input name="site" placeholder="Site" value={filters.site} onChange={handleInputChange} />
        <Input
          name="results_wanted"
          type="number"
          placeholder="Results wanted"
          value={filters.results_wanted || ""}
          onChange={handleInputChange}
        />
        <Input
          name="distance"
          type="number"
          placeholder="Distance"
          value={filters.distance || ""}
          onChange={handleInputChange}
        />
        <Input name="job_type" placeholder="Job type" value={filters.job_type} onChange={handleInputChange} />
        <Input name="country" placeholder="Country" value={filters.country} onChange={handleInputChange} />
        <Input
          name="batch_size"
          type="number"
          placeholder="Batch size"
          value={filters.batch_size || ""}
          onChange={handleInputChange}
        />
      </div>
      <Button type="submit" className="mt-4">
        Apply Filters
      </Button>
    </form>
  )
}

