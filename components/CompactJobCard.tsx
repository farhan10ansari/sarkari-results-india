"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";

/**
 * CompactJobCard Component
 * 
 * A compact card component for displaying job listings in grid layouts.
 * Features include:
 * - Consistent card height for uniform grid layout
 * - Job title and category display
 * - Active/Closed status badge based on last application date
 * - Colorful category badges with gradient backgrounds
 * - Hover effects with scale animation for better interactivity
 * - Responsive design
 */
interface CompactJobCardProps {
  id: string;
  title: string;
  category: string;
  lastDate?: string;
}

export function CompactJobCard({
  id,
  title,
  category,
  lastDate,
}: CompactJobCardProps) {
  return (
    <Link href={`/page/${id}`}>
      <div className="group h-full min-h-[110px] flex flex-col rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-3.5 transition-all hover:scale-[1.02] hover:border-[#1173d4] hover:shadow-lg dark:border-gray-800 dark:from-gray-900 dark:to-gray-800 dark:hover:border-[#1173d4]">
        {/* Title */}
        <h3 className="mb-2.5 line-clamp-2 flex-1 text-sm font-bold text-gray-900 group-hover:text-[#1173d4] dark:text-white dark:group-hover:text-[#1173d4] transition-colors">
          {title}
        </h3>
        
        {/* Bottom: Category Badge and Status Badge */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-1 dark:from-blue-900/30 dark:to-indigo-900/30">
            <Briefcase className="h-3 w-3 text-[#1173d4]" />
            <span className="text-xs font-semibold text-[#1173d4] dark:text-blue-400">
              {category}
            </span>
          </div>
          
          {lastDate && (
            <Badge 
              variant="secondary" 
              className={`text-xs font-medium shadow-sm ${
                new Date(lastDate) > new Date() 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white dark:from-green-600 dark:to-emerald-600 border-0" 
                  : "bg-gradient-to-r from-red-500 to-rose-500 text-white dark:from-red-600 dark:to-rose-600 border-0"
              }`}
            >
              {new Date(lastDate) > new Date() ? "✓ Active" : "✕ Closed"}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
