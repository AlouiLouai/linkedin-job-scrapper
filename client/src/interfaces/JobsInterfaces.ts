export interface Job {
  company_name: string;
  company_url: string;
  job_description: string;
  job_title: string;
  job_url: string;
  location: string;
}

export interface JobListProps {
  jobs: Job[];
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onJobClick: any;
}

export interface FilterNavbarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitFilters: (filters: any) => void;
}
