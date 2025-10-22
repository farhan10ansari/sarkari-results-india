"use client";

import Link from "next/link";
import { Award } from "lucide-react";

interface CompactSchemeCardProps {
  id: string;
  title: string;
  department: string;
  eligibility: string;
}

export function CompactSchemeCard({
  id,
  title,
  department,
  eligibility,
}: CompactSchemeCardProps) {
  return (
    <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-[#1173d4] hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#1173d4]">
      <div className="mb-2 flex items-start gap-2">
        <Award className="h-4 w-4 flex-shrink-0 text-[#1173d4]" />
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#1173d4] dark:text-white dark:group-hover:text-[#1173d4]">
          {title}
        </h3>
      </div>
      <p className="mb-2 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
        {department}
      </p>
      <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-500">
        <span className="font-medium">Eligibility:</span> {eligibility}
      </p>
    </div>
  );
}
