"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { CompactJobCard } from "@/components/CompactJobCard";
import { JobCardSkeleton } from "@/components/JobCardSkeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Filter, Loader2, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { IPage, PageType, PageStatus } from "@/lib/page.types";
import { JOB_CATEGORIES } from "@/lib/constants";

/**
 * JobsClient Component
 * 
 * Client-side component for the jobs listing page.
 * Receives initial server-rendered data for fast first load,
 * then uses the public jobs API for subsequent filter changes.
 * 
 * Features:
 * - Server-side initial data for performance
 * - Client-side filtering with React Query
 * - Uses public /api/jobs endpoint (separate from admin API)
 * - Server-side search functionality
 * - Category-based filtering
 * - Load more pagination
 * - Colorful, modern UI
 */

interface JobsResponse {
  jobs: IPage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface JobsClientProps {
  initialData: JobsResponse;
  initialCategory?: string;
  initialSearch?: string;
}

async function fetchJobs(page: number, category?: string, search?: string): Promise<JobsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
  });

  if (category && category !== "all") {
    params.append("category", category);
  }

  if (search) {
    params.append("search", search);
  }

  const response = await fetch(`/api/jobs?${params.toString()}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch jobs");
  }

  return data.data;
}

export default function JobsClient({ initialData, initialCategory = "all", initialSearch = "" }: JobsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const [allJobs, setAllJobs] = useState<IPage[]>([]);
  
  const selectedCategory = searchParams.get("category") || initialCategory;
  const searchQuery = searchParams.get("search") || initialSearch;

  // Fetch jobs using React Query with initial data
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["jobs", currentPage, selectedCategory, searchQuery],
    queryFn: () => fetchJobs(currentPage, selectedCategory, searchQuery),
    initialData: currentPage === 1 && selectedCategory === initialCategory && searchQuery === initialSearch ? initialData : undefined,
    staleTime: 60000, // 1 minute
  });

  // Update jobs when data changes
  useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        setAllJobs(data.jobs);
      } else {
        setAllJobs((prev) => [...prev, ...data.jobs]);
      }
    }
  }, [data, currentPage]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.delete("search"); // Reset search when changing category
    setSearchInput("");
    setCurrentPage(1);
    setAllJobs([]);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    setCurrentPage(1);
    setAllJobs([]);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setCurrentPage(1);
    setAllJobs([]);
    router.push("/jobs");
  };

  const displayJobs = currentPage === 1 ? (data?.jobs || []) : allJobs;
  const hasMore = data?.pagination.hasMore || false;
  const totalJobs = data?.pagination.total || 0;

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

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search jobs by title, description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-14 pl-12 pr-32 text-base border-2 border-gray-200 focus:border-[#1173d4] focus:ring-2 focus:ring-[#1173d4]/20 dark:border-gray-700 rounded-xl shadow-sm"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 bg-gradient-to-r from-[#1173d4] to-[#0d5aa7] hover:from-[#0d5aa7] hover:to-[#1173d4] shadow-md"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>

          {/* Category Filter - Below Search Bar on Left */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Filter className="h-4 w-4 text-[#1173d4]" />
                Filter by:
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[240px] h-11 border-2 border-gray-200 focus:border-[#1173d4] dark:border-gray-700 rounded-lg shadow-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="font-medium">All Categories</span>
                  </SelectItem>
                  {JOB_CATEGORIES.map((category) => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats and Clear Button */}
            <div className="flex items-center gap-4">
              {totalJobs > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-2 shadow-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    {totalJobs} Jobs Available
                  </span>
                </div>
              )}
              {(selectedCategory !== "all" || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="border-2 hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State - Only show when refetching, not on initial load */}
        {isLoading && !data && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Error Loading Jobs</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{(error as Error).message}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-6 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && displayJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-slate-200 dark:from-gray-700 dark:to-slate-700 shadow-inner">
              <Briefcase className="h-10 w-10 text-gray-400" />
            </div>
            <p className="mt-6 text-xl font-bold text-gray-900 dark:text-white">No Jobs Found</p>
            <p className="mt-2 max-w-md text-center text-gray-600 dark:text-gray-400">
              {searchQuery 
                ? "We couldn't find any jobs matching your search. Try adjusting your search terms."
                : selectedCategory !== "all"
                ? `No jobs available in this category at the moment.`
                : "No jobs are currently available. Check back later for new job postings."
              }
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="mt-6 border-2"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {!isLoading && !error && displayJobs.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayJobs.map((job) => (
                <CompactJobCard
                  key={job._id}
                  id={job.slug}
                  title={job.title}
                  category={job.category || "Others"}
                  lastDate={job.importantDates?.lastDateOfApplication}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  size="lg"
                  className="min-w-[240px] h-12 bg-gradient-to-r from-[#1173d4] to-[#0d5aa7] hover:from-[#0d5aa7] hover:to-[#1173d4] shadow-lg hover:shadow-xl transition-all"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    <>
                      Load More Jobs
                      <span className="ml-2 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold">
                        Page {currentPage} of {data?.pagination.totalPages}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* End Message */}
            {!hasMore && displayJobs.length > 6 && (
              <div className="mt-12 text-center">
                <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  You've reached the end! That's all the jobs for now.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
