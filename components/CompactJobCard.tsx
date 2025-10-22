"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";

interface CompactJobCardProps {
  id: string;
  title: string;
  department: string;
  location: string;
  lastDate?: string;
}

export function CompactJobCard({
  id,
  title,
  department,
  location,
  lastDate,
}: CompactJobCardProps) {
  return (
    <Link href={`/jobs/${id}`}>
      <div className="group rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-[#1173d4] hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#1173d4]">
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#1173d4] dark:text-white dark:group-hover:text-[#1173d4]">
          {title}
        </h3>
        <p className="mb-2 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
          {department}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{location}</span>
          </div>
          {lastDate && (
            <Badge variant="secondary" className="bg-red-50 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {new Date(lastDate) > new Date() ? "Active" : "Closed"}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
