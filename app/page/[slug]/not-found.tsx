import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home, Briefcase, FileText, GraduationCap } from "lucide-react";

/**
 * NotFound Component for Page Detail Route
 * 
 * Displays when a page with the specified slug cannot be found.
 * Provides helpful navigation options to common sections.
 * Features:
 * - Colorful gradient design matching the site theme
 * - Multiple navigation options (Home, Jobs, etc.)
 * - Clear error messaging
 * - Responsive layout
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 shadow-lg">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 sm:text-5xl">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or may have been removed.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button 
              asChild 
              size="lg" 
              className="min-w-[180px] bg-gradient-to-r from-[#1173d4] to-[#0d5aa7] hover:from-[#0d5aa7] hover:to-[#1173d4] shadow-lg"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="min-w-[180px] border-2"
            >
              <Link href="/jobs">
                <Briefcase className="mr-2 h-5 w-5" />
                Browse Jobs
              </Link>
            </Button>
          </div>

          {/* Quick Links Section */}
          <div className="mt-16 w-full max-w-2xl">
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
                Quick Links
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Link 
                  href="/jobs"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 transition-all hover:scale-105 hover:shadow-md dark:border-gray-700 dark:from-blue-900/20 dark:to-indigo-900/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1173d4] to-[#0d5aa7]">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Jobs</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Latest openings</p>
                  </div>
                </Link>

                <Link 
                  href="/results"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all hover:scale-105 hover:shadow-md dark:border-gray-700 dark:from-green-900/20 dark:to-emerald-900/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Results</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Exam results</p>
                  </div>
                </Link>

                <Link 
                  href="/admissions"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition-all hover:scale-105 hover:shadow-md dark:border-gray-700 dark:from-purple-900/20 dark:to-pink-900/20"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Admissions</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">New admissions</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            Error Code: 404 - Page Not Found
          </p>
        </div>
      </div>
    </div>
  );
}
