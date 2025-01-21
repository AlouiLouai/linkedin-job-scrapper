"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterNavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitFilters: (filters: any) => void;
}

export default function FilterNavbar({ onSubmitFilters }: FilterNavbarProps) {
  const [filters, setFilters] = useState({
    search_term: "",
    location: "",
    site: "linkedin",
    results_wanted: 100,
    distance: 25,
    job_type: "fulltime",
    country: "UK",
    batch_size: 30,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFilters(filters); // Pass filters to parent component
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 mb-4">
      <div className="grid grid-cols-4 gap-4">
        {Object.keys(filters).map((key) => (
          <Input
            key={key}
            name={key}
            placeholder={key.replace("_", " ").toUpperCase()}
            value={filters[key as keyof typeof filters] || ""}
            onChange={handleInputChange}
            type={
              typeof filters[key as keyof typeof filters] === "number"
                ? "number"
                : "text"
            }
          />
        ))}
      </div>
      <Button type="submit" className="mt-4">
        Apply Filters
      </Button>
    </form>
  );
}
