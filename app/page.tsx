import { HeroSection } from "@/components/home/HeroSection";
import { LatestJobsSection } from "@/components/home/LatestJobsSection";
import { LatestResultsSection } from "@/components/home/LatestResultsSection";
import { SchemesSection } from "@/components/home/SchemesSection";
import { AdmissionsSection } from "@/components/home/AdmissionsSection";
import { Footer } from "@/components/home/Footer";
import { dummyResults, dummySchemes, dummyAdmissions } from "@/lib/data";
import dbConnect from "@/db/mongodb";
import Page from "@/db/models/page-model";
import { IPage, PageType, PageStatus } from "@/lib/page.types";

/**
 * HomePage Server Component
 * 
 * Statically generated homepage that fetches latest job data at build time.
 * The page is cached and revalidated every 1 minute using ISR.
 * 
 * Benefits:
 * - Lightning-fast page loads (pre-rendered at build time)
 * - SEO-friendly with static content
 * - Automatic revalidation every 1 minute
 * - No loading state on direct navigation
 */

async function getLatestJobs(): Promise<IPage[]> {
  try {
    await dbConnect();

    // Fetch latest 6 published jobs
    const jobs = await Page.find({
      type: PageType.JOB,
      status: PageStatus.PUBLISHED,
    })
      .select('_id title slug category importantDates')
      .sort({ updatedAt: -1 })
      .limit(6)
      .lean();

    // Convert MongoDB documents to plain objects for serialization
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    console.error('Error fetching latest jobs:', error);
    // Return empty array on error to prevent page crash
    return [];
  }
}

export default async function HomePage() {
  const latestJobs = await getLatestJobs();
  const latestResults = dummyResults.slice(0, 6);
  const latestSchemes = dummySchemes.slice(0, 6);
  const latestAdmissions = dummyAdmissions.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <main className="flex flex-1 flex-col py-6 sm:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <HeroSection />

          <div className="space-y-8">
            <LatestJobsSection jobs={latestJobs} />
            <LatestResultsSection results={latestResults} />
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <SchemesSection schemes={latestSchemes} />
              <AdmissionsSection admissions={latestAdmissions} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Revalidate every 1 minute (60 seconds)
// This enables Incremental Static Regeneration (ISR)
// The page will be cached and regenerated in the background every 1 minute
export const revalidate = 60;

// Force static rendering for this page
// This ensures the page is pre-rendered at build time and cached
export const dynamic = 'force-static';

// Metadata for SEO
export const metadata = {
  title: "Sarkari Results India - Latest Government Jobs, Results, Schemes & Admissions",
  description: "Get latest updates on government jobs, exam results, government schemes, and admissions. Your one-stop destination for all Sarkari information in India.",
};
