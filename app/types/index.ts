// Adzuna API response types
export interface AdzunaApiResponse {
  results: JobListing[];
  count: number;
  __CLASS__: string;
  mean: number;
}

export interface JobListing {
  id: string;
  title: string;
  description: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
    area: string[];
  };
  redirect_url: string;
  created: string;
  category: {
    label: string;
    tag: string;
  };
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: boolean;
  contract_type?: string;
  contract_time?: string;
  __CLASS__: string;
}

// Frontend job search params
export interface JobSearchParams {
  title?: string;
  location?: string;
  job_type?: string; // Added job_type parameter
  page?: number;
  results_per_page?: number;
  enhanced_search?: boolean; // Flag to enable AI-enhanced search
}

// API response format for our frontend
export interface JobApiResponse {
  jobs: JobListing[];
  totalJobs: number;
  totalPages: number;
  currentPage: number;
}

// Related jobs mapping for AI suggestion
export interface RelatedJobsMap {
  [key: string]: string[];
}