"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

export function SearchBar() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400 sm:pl-4">
        <Search className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>
      <Input
        type="search"
        placeholder="Search for jobs, schemes, results..."
        className="h-12 w-full rounded-lg border-[#1173d4]/20 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:border-[#1173d4] focus:ring-[#1173d4] dark:border-[#1173d4]/30 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 sm:h-14 sm:pl-12 sm:text-base"
      />
    </div>
  );
}
