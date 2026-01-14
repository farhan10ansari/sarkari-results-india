import { SearchBar } from "@/components/SearchBar";

/**
 * HeroSection Component
 * 
 * Displays the main hero section of the homepage with:
 * - Gradient title text
 * - Subtitle description
 * - Search bar for quick access
 */
export function HeroSection() {
  return (
    <div className="mb-8 text-center">
      <h1 className="mb-3 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300 sm:text-4xl lg:text-5xl">
        Sarkari Results India
      </h1>
      <p className="mb-6 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
        Latest Government Jobs, Results, Schemes & Admissions
      </p>
      <div className="mx-auto max-w-2xl">
        <SearchBar />
      </div>
    </div>
  );
}
