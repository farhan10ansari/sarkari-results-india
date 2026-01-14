import { CompactResultCard } from "@/components/CompactResultCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

/**
 * LatestResultsSection Component
 * 
 * Displays the latest exam results on the homepage.
 * Features:
 * - Green gradient icon background
 * - Responsive grid layout
 * - Link to full results page
 */
interface Result {
  id: string;
  title: string;
  examName: string;
  resultDate: string;
}

interface LatestResultsSectionProps {
  results: Result[];
}

export function LatestResultsSection({ results }: LatestResultsSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 sm:text-2xl">
            Latest Results
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-[#1173d4] hover:text-[#1173d4]/80"
        >
          <Link href="/results">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <CompactResultCard
            key={result.id}
            id={result.id}
            title={result.title}
            examName={result.examName}
            resultDate={result.resultDate}
          />
        ))}
      </div>
    </section>
  );
}
