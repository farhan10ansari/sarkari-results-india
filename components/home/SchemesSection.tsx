import { CompactSchemeCard } from "@/components/CompactSchemeCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";

/**
 * SchemesSection Component
 * 
 * Displays government schemes on the homepage.
 * Features:
 * - Amber/Orange gradient icon background
 * - Vertical list layout
 * - Link to full schemes page
 */
interface Scheme {
  id: string;
  title: string;
  department: string;
  eligibility: string;
}

interface SchemesSectionProps {
  schemes: Scheme[];
}

export function SchemesSection({ schemes }: SchemesSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
            <Award className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 sm:text-2xl">
            Government Schemes
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-[#1173d4] hover:text-[#1173d4]/80"
        >
          <Link href="/schemes">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {schemes.map((scheme) => (
          <CompactSchemeCard
            key={scheme.id}
            id={scheme.id}
            title={scheme.title}
            department={scheme.department}
            eligibility={scheme.eligibility}
          />
        ))}
      </div>
    </section>
  );
}
