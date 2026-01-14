import { CompactJobCard } from "@/components/CompactJobCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { IPage } from "@/lib/page.types";

/**
 * LatestJobsSection Component
 * 
 * Displays the latest 6 government job listings on the homepage.
 * Features:
 * - Gradient icon background
 * - Responsive grid layout
 * - Link to full jobs page
 */
interface LatestJobsSectionProps {
  jobs: IPage[];
}

export function LatestJobsSection({ jobs }: LatestJobsSectionProps) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1173d4] to-[#0d5aa7] shadow-md">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 sm:text-2xl">
            Latest Jobs
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-[#1173d4] hover:text-[#1173d4]/80"
        >
          <Link href="/jobs">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <CompactJobCard
            key={job._id}
            id={job.slug}
            title={job.title}
            category={job.category || 'General'}
            lastDate={job.importantDates?.lastDateOfApplication || ''}
          />
        ))}
      </div>
    </section>
  );
}
