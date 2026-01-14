import { CompactAdmissionCard } from "@/components/CompactAdmissionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";

/**
 * AdmissionsSection Component
 * 
 * Displays latest admission notices on the homepage.
 * Features:
 * - Purple/Pink gradient icon background
 * - Vertical list layout
 * - Link to full admissions page
 */
interface Admission {
  id: string;
  institutionName: string;
  programName: string;
  applicationDeadline: string;
}

interface AdmissionsSectionProps {
  admissions: Admission[];
}

export function AdmissionsSection({ admissions }: AdmissionsSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 sm:text-2xl">
            Admissions
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          className="text-[#1173d4] hover:text-[#1173d4]/80"
        >
          <Link href="/admissions">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {admissions.map((admission) => (
          <CompactAdmissionCard
            key={admission.id}
            id={admission.id}
            institutionName={admission.institutionName}
            programName={admission.programName}
            applicationDeadline={admission.applicationDeadline}
          />
        ))}
      </div>
    </section>
  );
}
