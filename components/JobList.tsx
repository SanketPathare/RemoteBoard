import { JobCard } from "./JobCard";
import type { Job } from "@/lib/types";

export function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {jobs.map((j) => (
        <li key={j.id} className="flex min-w-0">
          <div className="min-w-0 flex-1">
            <JobCard job={j} />
          </div>
        </li>
      ))}
    </ul>
  );
}
