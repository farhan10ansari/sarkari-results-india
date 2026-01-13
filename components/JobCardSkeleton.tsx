/**
 * JobCardSkeleton Component
 * 
 * A loading skeleton component that displays while job cards are being fetched.
 * Provides visual feedback to users during data loading.
 * Features:
 * - Animated shimmer effect
 * - Matches the layout and height of CompactJobCard
 * - Responsive design with consistent height
 */
export function JobCardSkeleton() {
  return (
    <div className="h-full min-h-[140px] rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
      <div className="animate-pulse flex flex-col h-full">
        {/* Badge skeleton */}
        <div className="mb-3 flex justify-end">
          <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        
        {/* Title skeleton */}
        <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-3 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Category badge skeleton */}
        <div className="mt-auto">
          <div className="h-7 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
