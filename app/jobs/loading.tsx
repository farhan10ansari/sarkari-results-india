import { JobCardSkeleton } from "@/components/JobCardSkeleton";
import { Briefcase, Sparkles } from "lucide-react";

/**
 * Loading Component for Jobs List Page
 * 
 * Displays a loading state while the jobs list is being fetched.
 * Shows skeleton cards that match the layout of the actual job cards.
 * Features colorful gradients matching the main page design.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1173d4] to-[#0d5aa7] shadow-lg">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 sm:text-4xl">
                Government Jobs
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Find your dream government job
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section Skeleton */}
        <div className="mb-8 space-y-4">
          {/* Search Bar Skeleton */}
          <div className="h-14 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 shadow-sm"></div>
          
          {/* Filter Row Skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-[240px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"></div>
          </div>
        </div>

        {/* Jobs Grid Skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
