import { IPage, PageType, PageStatus } from "@/lib/page.types";
import JobsClient from "./JobsClient";
import dbConnect from "@/db/mongodb";
import Page from "@/db/models/page-model";

/**
 * JobsPage Server Component
 * 
 * Statically generated page that fetches initial job data at build time.
 * The page is cached and revalidated every 10 minutes using ISR.
 * All filtering and search is handled client-side for optimal performance.
 * 
 * Benefits:
 * - Lightning-fast page loads (pre-rendered at build time)
 * - SEO-friendly with static content
 * - Automatic revalidation every 1 minutes
 * - Client-side filtering via public API
 * - No loading state on direct navigation
 * 
 * Note: This page is statically generated (force-static).
 * All dynamic filtering uses the client-side /api/jobs endpoint.
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

async function getInitialJobs(): Promise<JobsResponse> {
  try {
    await dbConnect();

    // Simple query - fetch all published jobs
    const query = {
      type: PageType.JOB,
      status: PageStatus.PUBLISHED,
    };

    const page = 1;
    const limit = 12;

    // Fetch latest jobs for initial page load
    const pages = await Page.find(query)
      .select('_id title slug category status updatedAt type importantDates description')
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    const total = await Page.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Convert MongoDB documents to plain objects for serialization
    const serializedJobs = JSON.parse(JSON.stringify(pages));

    return {
      jobs: serializedJobs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  } catch (error) {
    console.error('Error fetching initial jobs:', error);
    // Return empty data on error to prevent page crash
    return {
      jobs: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
        hasMore: false,
      },
    };
  }
}

export default async function JobsPage() {
  const initialData = await getInitialJobs();
  
  return (
    <JobsClient
      initialData={initialData}
      initialCategory="all"
      initialSearch=""
    />
  );
}

// Revalidate every 1 minutes (60 seconds)
// This enables Incremental Static Regeneration (ISR)
// The page will be cached and regenerated in the background every 10 minutes
export const revalidate = 60;

// Force static rendering for this page
// This ensures the page is pre-rendered at build time and cached
export const dynamic = 'force-static';

// Metadata for SEO
export const metadata = {
  title: "Government Jobs - Sarkari Results India",
  description: "Browse the latest government job opportunities in India. Find jobs by category, search by keywords, and apply for positions across various government departments.",
};
