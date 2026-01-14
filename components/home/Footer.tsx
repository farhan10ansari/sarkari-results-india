import Link from "next/link";

/**
 * Footer Component
 * 
 * Displays the site footer with:
 * - Quick links navigation
 * - Category links
 * - Resources
 * - About section
 * - Copyright information
 */
export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/jobs" className="hover:text-[#1173d4]">Latest Jobs</Link></li>
              <li><Link href="/results" className="hover:text-[#1173d4]">Results</Link></li>
              <li><Link href="/admissions" className="hover:text-[#1173d4]">Admissions</Link></li>
              <li><Link href="/schemes" className="hover:text-[#1173d4]">Schemes</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-[#1173d4]">Banking</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">Railways</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">SSC</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">UPSC</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              Resources
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-[#1173d4]">Syllabus</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">Previous Papers</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">Admit Cards</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">Answer Keys</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
              About
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-[#1173d4]">About Us</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">Contact</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#1173d4]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Sarkari Results India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
