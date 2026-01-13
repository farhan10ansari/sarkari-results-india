import { IPage, PageType, PageStatus } from "@/lib/page.types";
import JobsClient from "./JobsClient";
import dbConnect from "@/db/mongodb";
import Page from "@/db/models/page-model";

/**
 * JobsPage Server Component
 * 
 * Server-side rendered page that fetches initial job data for fast loading.
 * The initial data is then passed to the client component which handles
 * filtering and pagination using the public jobs API.
 * 
 * Benefits:
 * - Fast initial page load with server-side rendering
 * - SEO-friendly with pre-rendered content
 * - Caching at the server level
 * - Client-side interactivity for filters
 * - Direct database access (no API overhead for initial load)
 * 
 * Note: This server component directly accesses the database.
 * Client-side filtering uses the public /api/jobs endpoint.
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

interface PageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

async function getInitialJobs(category?: string, search?: string): Promise<JobsResponse> {
  try {
    await dbConnect();

    // Build query
    const query: any = {
      type: PageType.JOB,
      status: PageStatus.PUBLISHED,
    };

    if (category && category !== "all") {
      query.category = category;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const page = 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    // Fetch pages with pagination
    const pages = await Page.find(query)
      .select('_id title slug category status updatedAt type importantDates description')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Page.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Convert MongoDB documents to plain objects
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
    // Return empty data on error
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

export default async function JobsPage({ searchParams }: PageProps) {
  // Await searchParams as it's async in Next.js 15+
  const params = await searchParams;
  const category = params.category || "all";
  const search = params.search || "";

  // Fetch initial data on the server
  const initialData = await getInitialJobs(
    category !== "all" ? category : undefined,
    search
  );

  // Pass initial data to client component
  return (
    <JobsClient
      initialData={initialData}
      initialCategory={category}
      initialSearch={search}
    />
  );
}

// Metadata for SEO
export const metadata = {
  title: "Government Jobs - Sarkari Results India",
  description: "Browse the latest government job opportunities in India. Find jobs by category, search by keywords, and apply for positions across various government departments.",
};
