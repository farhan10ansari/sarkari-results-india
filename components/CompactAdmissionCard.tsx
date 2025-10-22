"use client";

import Link from "next/link";
import { GraduationCap, Calendar } from "lucide-react";

interface CompactAdmissionCardProps {
  id: string;
  institutionName: string;
  programName: string;
  applicationDeadline?: string;
}

export function CompactAdmissionCard({
  id,
  institutionName,
  programName,
  applicationDeadline,
}: CompactAdmissionCardProps) {
  const formattedDeadline = applicationDeadline
    ? new Date(applicationDeadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-[#1173d4] hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#1173d4]">
      <div className="mb-2 flex items-start gap-2">
        <GraduationCap className="h-4 w-4 flex-shrink-0 text-[#1173d4]" />
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#1173d4] dark:text-white dark:group-hover:text-[#1173d4]">
          {institutionName}
        </h3>
      </div>
      <p className="mb-2 line-clamp-1 text-xs text-[#1173d4] dark:text-[#1173d4]">
        {programName}
      </p>
      {formattedDeadline && (
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Deadline: {formattedDeadline}</span>
        </div>
      )}
    </div>
  );
}
