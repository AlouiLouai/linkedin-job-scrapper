"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { FilterNavbarProps } from "@/interfaces/JobsInterfaces";

export default function FilterNavbar({ onSubmitFilters }: FilterNavbarProps) {
  const [filters, setFilters] = useState({
    search_term: "",
    location: "",
    results_wanted: 100,
    distance: 25,
    job_type: "fulltime",
    country: "UK",
    hours_old: 24,
    batch_size: 30,
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
    onSubmitFilters(filters); // Pass filters to parent component
  };

  const handleClearFilters = () => {
    setFilters({
      search_term: "",
      location: "",
      results_wanted: 100,
      distance: 25,
      job_type: "fulltime",
      country: "UK",
      hours_old: 24,
      batch_size: 30,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-4 mb-4 rounded-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Search Term */}
        <div className="flex flex-col">
          <label
            htmlFor="search_term"
            className="text-sm font-medium text-gray-600"
          >
            Search Term
          </label>
          <Input
            id="search_term"
            name="search_term"
            placeholder="Enter search term"
            value={filters.search_term}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label
            htmlFor="location"
            className="text-sm font-medium text-gray-600"
          >
            Location
          </label>
          <Input
            id="location"
            name="location"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        {/* Results Wanted */}
        <div className="flex flex-col">
          <label
            htmlFor="results_wanted"
            className="text-sm font-medium text-gray-600"
          >
            Results Wanted
          </label>
          <Input
            id="results_wanted"
            name="results_wanted"
            type="number"
            value={filters.results_wanted}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        {/* Distance */}
        <div className="flex flex-col">
          <label
            htmlFor="distance"
            className="text-sm font-medium text-gray-600"
          >
            Distance (miles)
          </label>
          <Input
            id="distance"
            name="distance"
            type="number"
            value={filters.distance}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        {/* Job Type Dropdown */}
        <div className="flex flex-col">
          <label
            htmlFor="job_type"
            className="text-sm font-medium text-gray-600"
          >
            Job Type
          </label>
          {/* Job Type Dropdown with Radix UI Select */}
        <div className="flex flex-col">
          <label htmlFor="job_type" className="text-sm font-medium text-gray-600">
            Job Type
          </label>
          <Select
            name="job_type"
            value={filters.job_type}
            onValueChange={(value: string) => handleSelectChange("job_type", value)}
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
        </div>

        {/* Country */}
        <div className="flex flex-col">
          <label
            htmlFor="country"
            className="text-sm font-medium text-gray-600"
          >
            Country
          </label>
          <Input
            id="country"
            name="country"
            placeholder="Enter country"
            value={filters.country}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        {/* Hours Old */}
        <div className="flex flex-col">
          <label
            htmlFor="hours_old"
            className="text-sm font-medium text-gray-600"
          >
            Hours Old
          </label>
          <Input
            id="hours_old"
            name="hours_old"
            type="number"
            value={filters.hours_old}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>

        {/* Batch Size */}
        <div className="flex flex-col">
          <label
            htmlFor="batch_size"
            className="text-sm font-medium text-gray-600"
          >
            Batch Size
          </label>
          <Input
            id="batch_size"
            name="batch_size"
            type="number"
            value={filters.batch_size}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button type="submit" className="bg-blue-600 text-white">
          Apply Filters
        </Button>
        <Button
          type="button"
          onClick={handleClearFilters}
          className="bg-gray-300 text-black"
        >
          Clear Filters
        </Button>
      </div>
    </form>
  );
}
