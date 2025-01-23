"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { FilterNavbarProps } from "@/interfaces/JobsInterfaces";

export default function FilterNavbar({ onSubmitFilters }: FilterNavbarProps) {
  const [filters, setFilters] = useState({
    search_term: "",
    location: "",
    distance: 25,
    job_type: "fulltime",
    country: "UK",
    hours_old: 24, // Default to 'Last Day'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFilters(filters); // Pass filters to the parent component
  };

  const handleClearFilters = () => {
    setFilters({
      search_term: "",
      location: "",
      distance: 25,
      job_type: "fulltime",
      country: "UK",
      hours_old: 24, // Reset to 'Last Day'
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 mb-6 rounded-lg flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4"
    >
      {/* Search Term */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        <label
          htmlFor="search_term"
          className="text-sm font-medium text-gray-600"
        >
          Search
        </label>
        <Input
          id="search_term"
          name="search_term"
          placeholder="Search job title"
          value={filters.search_term}
          onChange={handleInputChange}
          className="mt-1 sm:mt-0"
        />
      </div>

      {/* Location */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        <label
          htmlFor="location"
          className="text-sm font-medium text-gray-600"
        >
          Location
        </label>
        <Input
          id="location"
          name="location"
          placeholder="City or Remote"
          value={filters.location}
          onChange={handleInputChange}
          className="mt-1 sm:mt-0"
        />
      </div>

      {/* Distance */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        <label
          htmlFor="distance"
          className="text-sm font-medium text-gray-600"
        >
          Distance
        </label>
        <Input
          id="distance"
          name="distance"
          type="number"
          placeholder="Miles"
          value={filters.distance}
          onChange={handleInputChange}
          className="mt-1 sm:mt-0"
        />
      </div>

      {/* Job Type */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        <label
          htmlFor="job_type"
          className="text-sm font-medium text-gray-600"
        >
          Job Type
        </label>
        <Select
          name="job_type"
          value={filters.job_type}
          onValueChange={(value: string) =>
            handleSelectChange("job_type", value)
          }
        >
          <SelectTrigger className="border p-2 rounded-md">
            <span>{filters.job_type}</span>
          </SelectTrigger>
          <SelectContent className="border rounded-md p-2">
            <SelectItem value="fulltime">Fulltime</SelectItem>
            <SelectItem value="parttime">Part-time</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hours Old */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
        <label
          htmlFor="hours_old"
          className="text-sm font-medium text-gray-600"
        >
          Posted
        </label>
        <Select
          name="hours_old"
          value={filters.hours_old.toString()}
          onValueChange={(value: string) =>
            handleSelectChange("hours_old", parseInt(value, 10).toString())
          }
        >
          <SelectTrigger className="border p-2 rounded-md">
            <span>
              {
                {
                  "24": "Last Day",
                  "168": "Last Week",
                  "720": "Last Month",
                }[filters.hours_old.toString()] || "Custom"
              }
            </span>
          </SelectTrigger>
          <SelectContent className="border rounded-md p-2">
            <SelectItem value="24">Last Day</SelectItem>
            <SelectItem value="168">Last Week</SelectItem>
            <SelectItem value="720">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex space-x-2">
        <Button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Apply
        </Button>
        <Button
          type="button"
          onClick={handleClearFilters}
          className="bg-gray-300 text-black px-4 py-2"
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
