"use client";

import Link from "next/link";
import { Calendar, ExternalLink } from "lucide-react";

interface CompactResultCardProps {
  id: string;
  title: string;
  examName: string;
  resultDate: string;
}

export function CompactResultCard({
  id,
  title,
  examName,
  resultDate,
}: CompactResultCardProps) {
  const formattedDate = new Date(resultDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-[#1173d4] hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#1173d4]">
      <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#1173d4] dark:text-white dark:group-hover:text-[#1173d4]">
        {title}
      </h3>
      <p className="mb-2 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
        {examName}
      </p>
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
        <Calendar className="h-3 w-3" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
