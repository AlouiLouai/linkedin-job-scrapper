import FilterNavbar from "@/components/FilterNavbar";
import JobList from "@/components/JobList";
import JobDetail from "@/components/JobDetail";

export default function Home() {
  return (
    <main className="min-h-screen">
      <FilterNavbar />
      <div className="grid grid-cols-3 gap-4 p-4">
        <JobList />
        <JobDetail />
      </div>
    </main>
  );
}
